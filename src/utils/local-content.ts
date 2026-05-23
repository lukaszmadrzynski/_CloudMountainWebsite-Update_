import * as fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import frontmatter from 'front-matter';
import { allModels } from '../../sources/local/models';
import { Config } from '../../sources/local/models/Config';
import { getPageUrl } from './page-utils';

// TODO use types?

const pagesDir = 'content/pages';
const dataDir = 'content/data';

const allReferenceFields = {};
Object.entries(allModels).forEach(([modelName, model]) => {
    model.fields.forEach((field) => {
        if (field.type === 'reference' || (field.type === 'list' && field.items?.type === 'reference')) {
            allReferenceFields[modelName + ':' + field.name] = true;
        }
    });
});

function isRefField(modelName: string, fieldName: string) {
    return !!allReferenceFields[modelName + ':' + fieldName];
}

const supportedFileTypes = ['md', 'json'];
function contentFilesInPath(dir: string) {
    const globPattern = `${dir}/**/*.{${supportedFileTypes.join(',')}}`;
    return globSync(globPattern);
}

function readContent(file: string) {
    const rawContent = fs.readFileSync(file, 'utf8');
    let content = null;
    switch (path.extname(file).substring(1)) {
        case 'md':
            const parsedMd = frontmatter<Record<string, any>>(rawContent);
            content = {
                ...parsedMd.attributes,
                markdown_content: parsedMd.body
            };
            break;
        case 'json':
            content = JSON.parse(rawContent);
            break;
        default:
            throw Error(`Unhandled file type: ${file}`);
    }

    // Normalize file path to use forward slashes (for consistent lookups)
    const normalizedId = file.replace(/\\/g, '/');

    // Make Sourcebit-compatible
    content.__metadata = {
        id: file,
        normalizedId: normalizedId,
        modelName: content.type
    };

    return content;
}

// Helper function to normalize paths for lookup
function normalizePath(p: string): string {
    return p.replace(/\\/g, '/').replace(/^\/+/, '');
}

function resolveReferences(content, fileToContent) {
    if (!content || !content.type) return;

    const modelName = content.type;
    // Make Sourcebit-compatible
    if (!content.__metadata) content.__metadata = { modelName: content.type };

    for (const fieldName in content) {
        let fieldValue = content[fieldName];
        if (!fieldValue) continue;

        const isRef = isRefField(modelName, fieldName);
        if (Array.isArray(fieldValue)) {
            if (fieldValue.length === 0) continue;
            if (isRef && typeof fieldValue[0] === 'string') {
                fieldValue = fieldValue.map((filename) => fileToContent[filename]);
                content[fieldName] = fieldValue;
            }
            if (typeof fieldValue[0] === 'object') {
                fieldValue.forEach((o) => resolveReferences(o, fileToContent));
            }
        } else if (typeof fieldValue === 'string') {
            // Resolve top-level reference fields (e.g., footer: "content/data/footer.json")
            if (isRef && fileToContent[fieldValue]) {
                content[fieldName] = fileToContent[fieldValue];
                fieldValue = content[fieldName]; // Update for recursive call
            }
        }

        // Recursively process objects (including newly resolved references)
        if (typeof fieldValue === 'object' && fieldValue !== null) {
            resolveReferences(fieldValue, fileToContent);
        }
    }
}

export function allContent() {
    const [data, pages] = [dataDir, pagesDir].map((dir) => {
        return contentFilesInPath(dir).map((file) => readContent(file));
    });
    const objects = [...pages, ...data];
    
    // Create lookup maps with both original and normalized paths
    const fileToContent: Record<string, any> = {};
    const normalizedToContent: Record<string, any> = {};
    
    objects.forEach((e) => {
        // Original path (as returned by glob)
        fileToContent[e.__metadata.id] = e;
        // Normalized path (forward slashes)
        if (e.__metadata.normalizedId) {
            normalizedToContent[e.__metadata.normalizedId] = e;
        }
    });

    objects.forEach((e) => resolveReferences(e, fileToContent));

    pages.forEach((page) => {
        page.__metadata.urlPath = getPageUrl(page);
    });

    const siteConfig = data.find((e) => e.__metadata.modelName === Config.name);
    
    // Manually resolve header and footer references if they're strings
    // This is needed because the reference resolution doesn't handle string references for header/footer
    if (siteConfig) {
        // Try multiple path formats to find the match
        const tryResolvePath = (refPath: string) => {
            // Direct lookup with original path
            if (fileToContent[refPath]) return fileToContent[refPath];
            
            // Normalize refPath (forward slashes, no leading slash)
            const normalizedRef = normalizePath(refPath);
            
            // Try normalized version
            if (normalizedToContent[normalizedRef]) return normalizedToContent[normalizedRef];
            
            // Try with original path's basename matched against normalized
            const basename = path.basename(refPath);
            for (const key of Object.keys(normalizedToContent)) {
                if (key.endsWith('/' + basename) || key.endsWith('\\' + basename)) {
                    return normalizedToContent[key];
                }
            }
            
            return null;
        };
        
        if (typeof siteConfig.header === 'string') {
            const headerFile = tryResolvePath(siteConfig.header);
            if (headerFile) {
                siteConfig.header = headerFile;
            } else {
                console.warn('[allContent] Could not resolve header:', siteConfig.header);
            }
        }
        if (typeof siteConfig.footer === 'string') {
            const footerFile = tryResolvePath(siteConfig.footer);
            if (footerFile) {
                siteConfig.footer = footerFile;
            } else {
                console.warn('[allContent] Could not resolve footer:', siteConfig.footer);
            }
        }
    }
    
    return { objects, pages, props: { site: siteConfig } };
}

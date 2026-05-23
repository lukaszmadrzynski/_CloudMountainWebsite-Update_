// src/pages/[[...slug]].js

import React from 'react';

// Corrected imports - these are your utility functions that handle file system and parsing
import { allContent } from '../utils/local-content';
import { getComponent } from '../components/components-registry';
import { resolveStaticProps } from '../utils/static-props-resolvers';
import { resolveStaticPaths } from '../utils/static-paths-resolvers';

// Your Main Page Component (adapt this to your actual component)
function DynamicPage(props) {
  const { page, site, hasPageError, errorMessage, errorPageIdentifier } = props;

  if (hasPageError) {
    console.error(`[DynamicPage Component] Rendering error state for page: ${errorPageIdentifier}, Message: ${errorMessage}`);
    return (
      <div>
        <h1>Error Loading Page Content</h1>
        <p>We're sorry, but an issue occurred while trying to load the content for this page.</p>
        {process.env.NODE_ENV === 'development' && (
          <pre>Error for page: {errorPageIdentifier} - Message: {errorMessage}</pre>
        )}
      </div>
    );
  }

  if (!page) {
    console.warn('[DynamicPage Component] Page prop is missing. This might indicate an issue in resolveStaticProps or data.', props);
    return <div>Error: Page data is not available.</div>;
  }

  if (!page.__metadata) {
    throw new Error(`page has no type, page path from props: '${page.path || 'N/A'}'`);
  }

  const modelName = page.__metadata.modelName;
  if (!modelName) {
    throw new Error(`page has no modelName, page path from props: '${page.path || 'N/A'}'`);
  }

  const PageLayout = getComponent(modelName);
  if (!PageLayout) {
    throw new Error(`no page layout matching the page model: ${modelName}`);
  }

  return <PageLayout page={page} site={site} />;
}

// Helper to get an identifier for logging in the component
function pageIdentifierFromProps(props) {
    if (props.errorPageIdentifier) return props.errorPageIdentifier;
    if (props.page && props.page.path) return props.page.path;
    return 'Unknown Page';
}

export async function getStaticPaths() {
  console.log('[getStaticPaths] Starting...');
  try {
    const data = allContent(); // This function should read all .md files and parse them
    // console.log('[getStaticPaths] Data from allContent():', data); // For debugging
    const paths = resolveStaticPaths(data); // This function uses the parsed data to generate paths
    console.log(`[getStaticPaths] Successfully generated ${paths.length} paths.`);
    // console.log('[getStaticPaths] Example path object:', JSON.stringify(paths[0], null, 2));
    return { paths, fallback: false };
  } catch (error) {
    console.error('----------------------------------------------------------------');
    console.error('[getStaticPaths CAUGHT ERROR]');
    console.error(`Error Message: ${error.message}`);
    console.error(`Error Stack: ${error.stack}`);
    console.error(`Full Error Object:`, error);
    console.error('----------------------------------------------------------------');
    throw error;
  }
}

export async function getStaticProps({ params }) {
  let urlPath;
  if (params && params.slug && params.slug.length > 0) {
    urlPath = '/' + params.slug.join('/');
  } else {
    urlPath = '/'; // Homepage
  }

  console.log(`[getStaticProps START] for urlPath: "${urlPath}"`);

  try {
    // allContent() should provide all necessary data, including parsed frontmatter and content for all pages.
    // This is where fs, path, and gray-matter (or similar) would be used internally.
    const data = allContent();
    // console.log('[getStaticProps] Data from allContent() for path:', urlPath);

    // resolveStaticProps takes the urlPath and the full dataset from allContent()
    // and finds/returns the specific props for the requested page.
    // It should NOT need to do fs operations again if allContent() did its job.
    const props = await resolveStaticProps(urlPath, data);

    if (!props || !props.page) {
      console.warn(`[getStaticProps] 'resolveStaticProps' did not return a 'page' object in props for urlPath: "${urlPath}". Returning 404. Props received:`, props);
      return { notFound: true };
    }

    console.log(`[getStaticProps SUCCESS] for urlPath: "${urlPath}". Page title from props: ${props.page?.title || 'N/A'}`);
    return { props };

  } catch (error) {
    console.error('----------------------------------------------------------------');
    console.error(`[getStaticProps CAUGHT ERROR] for urlPath: "${urlPath}"`);
    // Check if the error might be a "file not found" type, even if abstracted by your utils
    // Your utility functions should ideally throw errors with a 'code' property if it's a file system error.
    if (error.code === 'ENOENT' || (error.message && (error.message.includes('ENOENT') || error.message.toLowerCase().includes('not found')))) {
      console.error(`Specific Hint: Error suggests a file or resource related to "${urlPath}" was not found. Check 'allContent' or 'resolveStaticProps' logic for how it handles missing files.`);
    }
    console.error(`Error Message: ${error.message}`);
    console.error(`Error Name: ${error.name}`);
    console.error(`Error Stack: ${error.stack}`);
    console.error(`Full Error Object:`, error);
    console.error('----------------------------------------------------------------');

    return { notFound: true };
  }
}

export default DynamicPage;

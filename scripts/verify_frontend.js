#!/usr/bin/env node
/**
 * NurdiansyahLabs — Frontend Build & Prerender Verification (R3)
 *
 * Verifies that:
 * 1. Vite build completes successfully and generates dist/ artifacts.
 * 2. All declared static routes have valid prerendered HTML files.
 * 3. Prerendered HTML contains expected DOM structure (#root, <title>, etc.).
 *
 * Usage:
 *   node scripts/verify_frontend.js [--skip-build]
 *
 * Exit code 0 = all checks pass, non-zero = failures detected.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(PROJECT_ROOT, 'dist');

// Load route declarations from data files
function loadDeclaredRoutes() {
    const routes = ['/'];

    try {
        const servicesData = JSON.parse(
            fs.readFileSync(path.resolve(PROJECT_ROOT, 'src/data/services.json'), 'utf-8')
        );
        if (servicesData.services) {
            servicesData.services.forEach(s => routes.push(`/services/${s.slug}`));
        }
    } catch (e) {
        console.warn('  ⚠️  Could not load services.json:', e.message);
    }

    try {
        const showcaseData = JSON.parse(
            fs.readFileSync(path.resolve(PROJECT_ROOT, 'src/data/showcase.json'), 'utf-8')
        );
        if (showcaseData.showcases) {
            showcaseData.showcases.forEach(s => routes.push(`/showcase/${s.categorySlug}/${s.slug}`));
        }
    } catch (e) {
        console.warn('  ⚠️  Could not load showcase.json:', e.message);
    }

    // Static routes always expected
    routes.push('/trends', '/blog');

    return [...new Set(routes)];
}

function verifyBuildArtifacts() {
    console.log('\n🔍 Check 1: Build artifacts in dist/...');
    const results = { passed: 0, failed: 0, details: [] };

    if (!fs.existsSync(DIST_DIR)) {
        results.failed++;
        results.details.push('  ❌ dist/ directory does not exist');
        return results;
    }

    // Check index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf-8');
        if (content.includes('<div id="root"') || content.includes('id="root"')) {
            results.passed++;
            results.details.push('  ✅ dist/index.html exists with #root');
        } else {
            results.failed++;
            results.details.push('  ❌ dist/index.html missing #root element');
        }
    } else {
        results.failed++;
        results.details.push('  ❌ dist/index.html not found');
    }

    // Check assets directory
    const assetsDir = path.join(DIST_DIR, 'assets');
    if (fs.existsSync(assetsDir)) {
        const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
        const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));

        if (jsFiles.length > 0) {
            results.passed++;
            results.details.push(`  ✅ ${jsFiles.length} JS bundle(s) found`);
        } else {
            results.failed++;
            results.details.push('  ❌ No JS bundles in dist/assets/');
        }

        if (cssFiles.length > 0) {
            results.passed++;
            results.details.push(`  ✅ ${cssFiles.length} CSS bundle(s) found`);
        } else {
            results.failed++;
            results.details.push('  ❌ No CSS bundles in dist/assets/');
        }
    } else {
        results.failed++;
        results.details.push('  ❌ dist/assets/ directory not found');
    }

    return results;
}

function verifyPrerenderedRoutes(declaredRoutes) {
    console.log('\n🔍 Check 2: Prerendered static HTML routes...');
    const results = { passed: 0, failed: 0, details: [] };

    for (const route of declaredRoutes) {
        const htmlPath = route === '/'
            ? path.join(DIST_DIR, 'index.html')
            : path.join(DIST_DIR, route, 'index.html');

        if (fs.existsSync(htmlPath)) {
            const content = fs.readFileSync(htmlPath, 'utf-8');
            const hasRoot = content.includes('id="root"');
            const hasTitle = content.includes('<title');
            const minSize = content.length > 500; // Not just a stub

            if (hasRoot && hasTitle && minSize) {
                results.passed++;
                results.details.push(`  ✅ ${route} → ${path.relative(DIST_DIR, htmlPath)} (${(content.length / 1024).toFixed(1)}KB)`);
            } else {
                results.failed++;
                const issues = [];
                if (!hasRoot) issues.push('missing #root');
                if (!hasTitle) issues.push('missing <title>');
                if (!minSize) issues.push('too small');
                results.details.push(`  ⚠️  ${route} → exists but ${issues.join(', ')}`);
            }
        } else {
            results.failed++;
            results.details.push(`  ❌ ${route} → missing (expected: ${path.relative(PROJECT_ROOT, htmlPath)})`);
        }
    }

    return results;
}

function verifySEOFiles() {
    console.log('\n🔍 Check 3: SEO and static files...');
    const results = { passed: 0, failed: 0, details: [] };

    const seoFiles = [
        { file: 'sitemap.xml', check: (c) => c.includes('<urlset') },
        { file: 'robots.txt', check: (c) => c.includes('User-agent') },
    ];

    for (const { file, check } of seoFiles) {
        const filepath = path.join(DIST_DIR, file);
        if (fs.existsSync(filepath)) {
            const content = fs.readFileSync(filepath, 'utf-8');
            if (check(content)) {
                results.passed++;
                results.details.push(`  ✅ ${file} exists and valid`);
            } else {
                results.failed++;
                results.details.push(`  ⚠️  ${file} exists but has unexpected content`);
            }
        } else {
            results.failed++;
            results.details.push(`  ❌ ${file} not found in dist/`);
        }
    }

    return results;
}

async function main() {
    const skipBuild = process.argv.includes('--skip-build');

    console.log('╔════════════════════════════════════════════╗');
    console.log('║  NurdiansyahLabs Frontend Verifier v1.0   ║');
    console.log('╚════════════════════════════════════════════╝');

    // Step 0: Run build if not skipped
    if (!skipBuild) {
        console.log('\n🔨 Running Vite build...');
        try {
            execSync('npm run build', {
                cwd: PROJECT_ROOT,
                stdio: 'pipe',
                timeout: 120_000,
            });
            console.log('  ✅ Build completed successfully.');
        } catch (err) {
            console.error('  ❌ Build FAILED:');
            console.error(err.stderr?.toString().slice(0, 500) || err.message);
            process.exit(1);
        }
    } else {
        console.log('\n⏩ Skipping build (--skip-build flag).');
    }

    const declaredRoutes = loadDeclaredRoutes();
    console.log(`\n📋 Declared routes: ${declaredRoutes.length}`);

    // Run checks
    const buildResults = verifyBuildArtifacts();
    buildResults.details.forEach(d => console.log(d));

    const prerenderResults = verifyPrerenderedRoutes(declaredRoutes);
    prerenderResults.details.forEach(d => console.log(d));

    const seoResults = verifySEOFiles();
    seoResults.details.forEach(d => console.log(d));

    // Summary
    const totalPassed = buildResults.passed + prerenderResults.passed + seoResults.passed;
    const totalFailed = buildResults.failed + prerenderResults.failed + seoResults.failed;

    console.log('\n' + '═'.repeat(60));
    console.log('  Frontend Verification Summary');
    console.log('═'.repeat(60));
    console.log(`  Build artifacts:   ${buildResults.passed} passed, ${buildResults.failed} failed`);
    console.log(`  Prerendered routes: ${prerenderResults.passed} passed, ${prerenderResults.failed} failed`);
    console.log(`  SEO files:         ${seoResults.passed} passed, ${seoResults.failed} failed`);
    console.log('─'.repeat(60));
    console.log(`  Total:             ${totalPassed} passed, ${totalFailed} failed`);

    if (totalFailed > 0) {
        console.log(`\n  ❌ FRONTEND VERIFICATION FAILED (${totalFailed} issue(s))`);
        process.exit(1);
    } else {
        console.log('\n  ✅ ALL FRONTEND CHECKS PASSED');
        process.exit(0);
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

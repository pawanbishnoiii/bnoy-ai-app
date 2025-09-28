// Simple installation script for Vercel deployment
const { execSync } = require('child_process');

console.log('🔥 BNOY STUDIOS - Installing dependencies...');

try {
  // Install with legacy peer deps to avoid conflicts
  execSync('npm install --legacy-peer-deps --production=false', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Installation complete!');
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
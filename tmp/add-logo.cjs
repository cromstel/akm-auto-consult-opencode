const fs = require('fs');
const logo = '<img src="/icon.svg" alt="AKM Logo" className="h-10 w-auto mb-4" />';
[
  'app/auth/admin/sign-in/page.tsx',
  'app/auth/claims/sign-in/page.tsx',
  'app/auth/customer/register/page.tsx'
].forEach(p => {
  if (!fs.existsSync(p)) { console.log('MISSING', p); return; }
  let d = fs.readFileSync(p, 'utf8');
  if (d.includes('AKM Logo')) { console.log('SKIP', p); return; }
  const i = d.indexOf('<h1');
  if (i < 0) { console.log('NO-H1', p); return; }
  d = d.slice(0, i) + logo + '\n      ' + d.slice(i);
  fs.writeFileSync(p, d);
  console.log('DONE', p);
});

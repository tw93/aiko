const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(html.slice(html.indexOf('    function getSvgCode ('), html.indexOf('    function downloadSvg (')), context);

function exportIcon(attributes) {
  return context.getSvgCode({ node: {
    attributes: Object.entries(attributes).map(([name, value]) => ({ name, value })),
    getAttribute: name => attributes[name] ?? null,
    innerHTML: '<path d="M1 1L20 20"/>',
  } }, '#c92b40');
}

test('outline exports retain stroke and transparent fill', () => {
  const svg = exportIcon({ id: 'outline', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' });
  for (const attr of ['viewBox="0 0 24 24"', 'fill="none"', 'stroke="currentColor"', 'stroke-width="2"', 'color="#c92b40"']) assert.ok(svg.includes(attr), attr);
  assert.ok(!svg.includes('id="outline"'));
  assert.ok(!svg.includes('fill="currentColor"'));
});

test('solid exports use the selected color without overwriting explicit fills', () => {
  assert.ok(exportIcon({ viewBox: '0 0 32 32' }).includes('fill="currentColor"'));
  const svg = exportIcon({ viewBox: '0 0 32 32', fill: '#123456', 'fill-rule': 'evenodd' });
  assert.ok(svg.includes('fill="#123456"'));
  assert.ok(svg.includes('fill-rule="evenodd"'));
  assert.ok(svg.includes('color="#c92b40"'));
});

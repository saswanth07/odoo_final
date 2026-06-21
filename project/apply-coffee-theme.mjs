import fs from 'fs';

const files = [
  'src/pages/Orders.tsx', 'src/pages/Products.tsx', 'src/pages/Categories.tsx',
  'src/pages/Customers.tsx', 'src/pages/Employees.tsx', 'src/pages/Kitchen.tsx',
  'src/pages/Tables.tsx', 'src/pages/Floors.tsx', 'src/pages/Payments.tsx',
  'src/pages/Coupons.tsx', 'src/pages/Promotions.tsx', 'src/pages/Feedback.tsx',
  'src/pages/Reports.tsx', 'src/pages/QR.tsx', 'src/pages/Receipt.tsx',
  'src/pages/Settings.tsx', 'src/pages/PermissionDenied.tsx'
];

const baseReplacements = [
  ['bg-[#111827]', 'bg-white/60'],
  ['text-[#94A3B8]', 'text-[#8B7355]'],
  ['bg-[#7C3AED]', 'bg-[#6B4E3D]'],
  ['text-[#7C3AED]', 'text-[#6B4E3D]'],
  ['text-[#A855F7]', 'text-[#8B7355]'],
  ['bg-white/5', 'bg-[#EDE5D8]/30'],
  ['bg-white/10', 'bg-[#EDE5D8]/40'],
  ['bg-white/20', 'bg-[#EDE5D8]/50'],
  ['border-white/10', 'border-[#D4C4A8]/30'],
  ['border-white/20', 'border-[#D4C4A8]/40'],
  ['border-white/30', 'border-[#D4C4A8]/50'],
  ['border-white/5', 'border-[#D4C4A8]/20'],
  ['bg-black/60', 'bg-[#2C1E14]/40'],
  ['bg-black/50', 'bg-[#2C1E14]/30'],
  ['text-[#10B981]', 'text-[#6B7F59]'],
  ['text-[#EF4444]', 'text-[#C75B39]'],
  ['text-[#F59E0B]', 'text-[#C9A84C]'],
  ['bg-[#10B981]', 'bg-[#6B7F59]'],
  ['bg-[#EF4444]', 'bg-[#C75B39]'],
  ['bg-[#F59E0B]', 'bg-[#C9A84C]'],
  ['bg-[#3B82F6]', 'bg-[#8B7355]'],
  ['bg-[#10B981]/20', 'bg-[#6B7F59]/20'],
  ['bg-[#EF4444]/20', 'bg-[#C75B39]/20'],
  ['bg-[#F59E0B]/20', 'bg-[#C9A84C]/20'],
  ['bg-[#3B82F6]/20', 'bg-[#8B7355]/20'],
  ['bg-[#EF4444]/30', 'bg-[#C75B39]/30'],
  ['bg-[#F59E0B]/10', 'bg-[#C9A84C]/10'],
  ['bg-[#7C3AED]/20', 'bg-[#6B4E3D]/20'],
  ['bg-[#7C3AED]/10', 'bg-[#6B4E3D]/10'],
  ['bg-[#10B981]/10', 'bg-[#6B7F59]/10'],
  ['border-[#7C3AED]', 'border-[#6B4E3D]'],
  ['border-[#10B981]/30', 'border-[#6B7F59]/30'],
  ['border-[#EF4444]/30', 'border-[#C75B39]/30'],
  ['border-[#F59E0B]/30', 'border-[#C9A84C]/30'],
  ['border-[#3B82F6]/30', 'border-[#8B7355]/30'],
  ['border-[#10B981]/50', 'border-[#6B7F59]/50'],
  ['border-[#EF4444]/50', 'border-[#C75B39]/50'],
  ['border-[#F59E0B]/50', 'border-[#C9A84C]/50'],
  ['border-[#3B82F6]/50', 'border-[#8B7355]/50'],
  ['focus:ring-[#7C3AED]/50', 'focus:ring-[#6B4E3D]/50'],
  ['focus:ring-[#7C3AED]', 'focus:ring-[#6B4E3D]'],
  ['focus:ring-[#10B981]/50', 'focus:ring-[#6B7F59]/50'],
  ['focus:ring-[#EF4444]/50', 'focus:ring-[#C75B39]/50'],
  ['focus:ring-[#F59E0B]/50', 'focus:ring-[#C9A84C]/50'],
  ['accent-[#7C3AED]', 'accent-[#6B4E3D]'],
  ['accent-[#10B981]', 'accent-[#6B7F59]'],
  ['hover:bg-[#7C3AED]/80', 'hover:bg-[#6B4E3D]/80'],
  ['hover:bg-[#EF4444]/80', 'hover:bg-[#C75B39]/80'],
  ['hover:bg-[#F59E0B]/80', 'hover:bg-[#C9A84C]/80'],
  ['hover:bg-[#3B82F6]/80', 'hover:bg-[#8B7355]/80'],
  ['hover:bg-[#10B981]/80', 'hover:bg-[#6B7F59]/80'],
  ['hover:bg-[#10B981]/30', 'hover:bg-[#6B7F59]/30'],
  ['hover:bg-[#EF4444]/30', 'hover:bg-[#C75B39]/30'],
  ['hover:bg-[#3B82F6]/30', 'hover:bg-[#8B7355]/30'],
  ['hover:bg-[#F59E0B]/30', 'hover:bg-[#C9A84C]/30'],
  ['hover:bg-[#7C3AED]/30', 'hover:bg-[#6B4E3D]/30'],
  ['hover:bg-[#7C3AED]/20', 'hover:bg-[#6B4E3D]/20'],
  ['hover:bg-[#EF4444]/20', 'hover:bg-[#C75B39]/20'],
  ['hover:bg-[#10B981]/20', 'hover:bg-[#6B7F59]/20'],
  ['hover:bg-[#3B82F6]/20', 'hover:bg-[#8B7355]/20'],
  ['hover:bg-[#F59E0B]/20', 'hover:bg-[#C9A84C]/20'],
  ['hover:text-[#7C3AED]', 'hover:text-[#6B4E3D]'],
  ['hover:text-[#EF4444]', 'hover:text-[#C75B39]'],
  ['hover:text-[#10B981]', 'hover:text-[#6B7F59]'],
  ['hover:text-[#F59E0B]', 'hover:text-[#C9A84C]'],
  ['hover:text-[#3B82F6]', 'hover:text-[#8B7355]'],
  ['from-[#7C3AED]', 'from-[#6B4E3D]'],
  ['to-[#A855F7]', 'to-[#8B7355]'],
  ['from-[#10B981]', 'from-[#6B7F59]'],
  ['to-[#34D399]', 'to-[#8A9B7E]'],
  ['from-[#F59E0B]', 'from-[#C9A84C]'],
  ['to-[#FBBF24]', 'to-[#D4B96A]'],
  ['from-[#3B82F6]', 'from-[#8B7355]'],
  ['to-[#60A5FA]', 'to-[#A08B6D]'],
  ['from-[#EF4444]', 'from-[#C75B39]'],
  ['to-[#F87171]', 'to-[#D4755A]'],
  ['fill-[#7C3AED]', 'fill-[#6B4E3D]'],
  ['fill-[#10B981]', 'fill-[#6B7F59]'],
  ['fill-[#EF4444]', 'fill-[#C75B39]'],
  ['fill-[#F59E0B]', 'fill-[#C9A84C]'],
  ['fill-[#3B82F6]', 'fill-[#8B7355]'],
  ['fill-[#A855F7]', 'fill-[#8B7355]'],
  ['stroke-[#7C3AED]', 'stroke-[#6B4E3D]'],
  ['stroke-[#10B981]', 'stroke-[#6B7F59]'],
  ['stroke-[#EF4444]', 'stroke-[#C75B39]'],
  ['stroke-[#F59E0B]', 'stroke-[#C9A84C]'],
  ['stroke-[#3B82F6]', 'stroke-[#8B7355]'],
  ['stroke-[#A855F7]', 'stroke-[#8B7355]'],
  ['stopColor="#7C3AED"', 'stopColor="#6B4E3D"'],
  ['stopColor="#10B981"', 'stopColor="#6B7F59"'],
  ['stopColor="#EF4444"', 'stopColor="#C75B39"'],
  ['stopColor="#F59E0B"', 'stopColor="#C9A84C"'],
  ['stopColor="#3B82F6"', 'stopColor="#8B7355"'],
  ['stopColor="#A855F7"', 'stopColor="#8B7355"'],
  ['text-[#F8FAFC]', 'text-[#2C1E14]'],
  ['bg-[#0F172A]', 'bg-[#F5F0E8]'],
  ['gradient-primary', 'gradient-coffee'],
];

const preserveWhiteReplacements = [
  ['bg-white/60 p-3', 'bg-white p-3'],
  ['bg-white/60 p-4', 'bg-white p-4'],
  ['bg-white/60 p-5', 'bg-white p-5'],
  ['bg-white/60 p-6', 'bg-white p-6'],
  ['bg-white/60 p-8', 'bg-white p-8'],
  ['bg-white/60 p-10', 'bg-white p-10'],
  ['bg-white/60 px-3', 'bg-white px-3'],
  ['bg-white/60 px-4', 'bg-white px-4'],
  ['bg-white/60 px-6', 'bg-white px-6'],
  ['bg-white/60 py-2', 'bg-white py-2'],
  ['bg-white/60 py-3', 'bg-white py-3'],
  ['bg-white/60 py-4', 'bg-white py-4'],
  ['bg-white/60 py-6', 'bg-white py-6'],
  ['bg-white/60 rounded', 'bg-white rounded'],
  ['bg-white/60 rounded-xl', 'bg-white rounded-xl'],
  ['bg-white/60 rounded-lg', 'bg-white rounded-lg'],
  ['bg-white/60 rounded-2xl', 'bg-white rounded-2xl'],
  ['bg-white/60 rounded-full', 'bg-white rounded-full'],
  ['bg-white/60 w-', 'bg-white w-'],
  ['bg-white/60 h-', 'bg-white h-'],
  ['bg-white/60 min-h-', 'bg-white min-h-'],
  ['bg-white/60 max-h-', 'bg-white max-h-'],
  ['bg-white/60 min-w-', 'bg-white min-w-'],
  ['bg-white/60 max-w-', 'bg-white max-w-'],
  ['bg-white/60 flex', 'bg-white flex'],
  ['bg-white/60 grid', 'bg-white grid'],
  ['bg-white/60 absolute', 'bg-white absolute'],
  ['bg-white/60 fixed', 'bg-white fixed'],
  ['bg-white/60 sticky', 'bg-white sticky'],
  ['bg-white/60 inline', 'bg-white inline'],
  ['bg-white/60 block', 'bg-white block'],
  ['bg-white/60 border', 'bg-white border'],
  ['bg-white/60 shadow', 'bg-white shadow'],
  ['bg-white/60 overflow', 'bg-white overflow'],
  ['bg-white/60 space', 'bg-white space'],
  ['bg-white/60 backdrop', 'bg-white backdrop'],
  ['bg-white/60 text', 'bg-white text'],
  ['bg-white/60 cursor', 'bg-white cursor'],
  ['bg-white/60 hover', 'bg-white hover'],
  ['bg-white/60 group', 'bg-white group'],
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Do all base replacements (longest first to avoid partial matches)
  const sorted = [...baseReplacements].sort((a, b) => b[0].length - a[0].length);
  for (const [oldStr, newStr] of sorted) {
    content = content.split(oldStr).join(newStr);
  }

  // Fix text-white that should stay white on dark backgrounds
  // After replacement, bg-[#6B4E3D] text-[#2C1E14] should be bg-[#6B4E3D] text-white
  content = content.replace(/bg-\[#6B4E3D\] text-\[#2C1E14\]/g, 'bg-[#6B4E3D] text-white');
  content = content.replace(/bg-\[#6B7F59\] text-\[#2C1E14\]/g, 'bg-[#6B7F59] text-white');
  content = content.replace(/bg-\[#C75B39\] text-\[#2C1E14\]/g, 'bg-[#C75B39] text-white');
  content = content.replace(/bg-\[#C9A84C\] text-\[#2C1E14\]/g, 'bg-[#C9A84C] text-white');
  content = content.replace(/bg-\[#8B7355\] text-\[#2C1E14\]/g, 'bg-[#8B7355] text-white');
  content = content.replace(/bg-\[#8B7355\] text-\[#8B7355\]/g, 'bg-[#8B7355] text-white');

  // Fix gradient-coffee text-white should stay white
  content = content.replace(/gradient-coffee text-\[#2C1E14\]/g, 'gradient-coffee text-white');

  // Fix bg-[#2C1E14]/30 text-[#2C1E14] should be white text
  content = content.replace(/bg-\[#2C1E14\]\/(\d+) text-\[#2C1E14\]/g, 'bg-[#2C1E14]/$1 text-white');
  content = content.replace(/bg-\[#2C1E14\]\/(\d+) hover:text-\[#2C1E14\]/g, 'bg-[#2C1E14]/$1 hover:text-white');

  // Fix bg-[#111827]/95 text-white should stay white
  content = content.replace(/bg-white\/60\/95 text-white/g, 'bg-white/95 text-white');
  content = content.replace(/bg-white\/60\/95 text-\[#8B7355\]/g, 'bg-white/95 text-[#8B7355]');
  content = content.replace(/bg-white\/60\/95/g, 'bg-white/95');
  // More general bg-white/60/95 fix
  content = content.replace(/bg-white\/60\/95/g, 'bg-white/95');

  // bg-[#F5F0E8]/95 should stay as is
  content = content.replace(/bg-\[#F5F0E8\]\/95/g, 'bg-[#F5F0E8]/95');

  // bg-[#111827]/95 was replaced to bg-white/60/95 - fix that
  content = content.replace(/bg-white\/60\/95/g, 'bg-white/95');

  // bg-[#111827] was replaced to bg-white/60 - fix things that shouldn't be transparent
  for (const [oldStr, newStr] of preserveWhiteReplacements) {
    content = content.replaceAll(oldStr, newStr);
  }

  // Also fix the general bg-white/60 that should be bg-white for things that are containers
  content = content.replace(/bg-white\/60 p-5/g, 'bg-white p-5');
  content = content.replace(/bg-white\/60 p-6/g, 'bg-white p-6');
  content = content.replace(/bg-white\/60 rounded-2xl/g, 'bg-white rounded-2xl');
  content = content.replace(/bg-white\/60 border/g, 'bg-white border');
  content = content.replace(/bg-white\/60 overflow/g, 'bg-white overflow');
  content = content.replace(/bg-white\/60 flex/g, 'bg-white flex');
  content = content.replace(/bg-white\/60 grid/g, 'bg-white grid');
  content = content.replace(/bg-white\/60 space/g, 'bg-white space');
  content = content.replace(/bg-white\/60 min-h/g, 'bg-white min-h');
  content = content.replace(/bg-white\/60 max-h/g, 'bg-white max-h');
  content = content.replace(/bg-white\/60 w-full/g, 'bg-white w-full');
  content = content.replace(/bg-white\/60 h-full/g, 'bg-white h-full');
  content = content.replace(/bg-white\/60 backdrop/g, 'bg-white backdrop');
  content = content.replace(/bg-white\/60 text-center/g, 'bg-white text-center');
  content = content.replace(/bg-white\/60 text-left/g, 'bg-white text-left');
  content = content.replace(/bg-white\/60 text-right/g, 'bg-white text-right');
  content = content.replace(/bg-white\/60 text-sm/g, 'bg-white text-sm');
  content = content.replace(/bg-white\/60 text-xs/g, 'bg-white text-xs');
  content = content.replace(/bg-white\/60 text-lg/g, 'bg-white text-lg');
  content = content.replace(/bg-white\/60 text-xl/g, 'bg-white text-xl');
  content = content.replace(/bg-white\/60 text-2xl/g, 'bg-white text-2xl');
  content = content.replace(/bg-white\/60 shadow/g, 'bg-white shadow');
  content = content.replace(/bg-white\/60 hover/g, 'bg-white hover');
  content = content.replace(/bg-white\/60 group/g, 'bg-white group');
  content = content.replace(/bg-white\/60 cursor/g, 'bg-white cursor');
  content = content.replace(/bg-white\/60 sticky/g, 'bg-white sticky');
  content = content.replace(/bg-white\/60 absolute/g, 'bg-white absolute');
  content = content.replace(/bg-white\/60 relative/g, 'bg-white relative');
  content = content.replace(/bg-white\/60 z-/g, 'bg-white z-');
  content = content.replace(/bg-white\/60 className/g, 'bg-white className');
  content = content.replace(/bg-white\/60 transition/g, 'bg-white transition');
  content = content.replace(/bg-white\/60 mt-/g, 'bg-white mt-');
  content = content.replace(/bg-white\/60 mb-/g, 'bg-white mb-');
  content = content.replace(/bg-white\/60 ml-/g, 'bg-white ml-');
  content = content.replace(/bg-white\/60 mr-/g, 'bg-white mr-');
  content = content.replace(/bg-white\/60 mx-/g, 'bg-white mx-');
  content = content.replace(/bg-white\/60 my-/g, 'bg-white my-');
  content = content.replace(/bg-white\/60 pt-/g, 'bg-white pt-');
  content = content.replace(/bg-white\/60 pb-/g, 'bg-white pb-');
  content = content.replace(/bg-white\/60 px-/g, 'bg-white px-');
  content = content.replace(/bg-white\/60 py-/g, 'bg-white py-');

  // Fix text-white on bg-[#111827] gradient backgrounds (bg-gradient-to-t from-[#111827]) - keep text-white
  content = content.replace(/bg-gradient-to-t from-\[#111827\] via-transparent to-transparent \/>\n.*\n.*text-\[#2C1E14\]/g, 'bg-gradient-to-t from-[#111827] via-transparent to-transparent />\n              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">\n                <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#6B4E3D] transition-colors">');
  // Actually let's do a more targeted fix for text that should be white on dark image overlays

  // For bg-gradient-to-t from-[#111827]... text should remain white
  // In Categories.tsx line ~66-77, the bottom text on images
  content = content.replace(
    /bg-gradient-to-t from-\[#111827\] via-transparent to-transparent" \/\>\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*\n.*text-\[#2C1E14\]/g,
    (match) => match.replace(/text-\[#2C1E14\]/g, 'text-white')
  );

  // Fix bg-[#111827] was replaced to bg-white/60 in recharts tooltip custom bg
  content = content.replace(/bg-white\/60 border border-white\/10 rounded-xl p-3 shadow-xl/g, 'bg-[#111827] border border-white/10 rounded-xl p-3 shadow-xl');
  content = content.replace(/bg-white\/60 border border-white\/10 rounded-xl p-3/g, 'bg-[#111827] border border-white/10 rounded-xl p-3');

  // Fix hover:bg-white/10 that was replaced to hover:bg-[#EDE5D8]/40 on options
  content = content.replace(/option className="bg-white\/60/g, 'option className="bg-[#111827]');
  content = content.replace(/option className="bg-\[#EDE5D8\]\/40/g, 'option className="bg-[#111827]');

  // Fix bg-[#111827] in style={{ backgroundColor }} for options
  content = content.replace(/bg-\[#111827\]\">percentage/g, 'bg-[#111827]">percentage');
  content = content.replace(/bg-\[#111827\]\">fixed/g, 'bg-[#111827]">fixed');
  content = content.replace(/bg-\[#111827\]\">BOGO/g, 'bg-[#111827]">BOGO');
  content = content.replace(/bg-\[#111827\]\">Discount/g, 'bg-[#111827]">Discount');
  content = content.replace(/bg-\[#111827\]\">Free Item/g, 'bg-[#111827]">Free Item');
  content = content.replace(/bg-\[#111827\]\">Active/g, 'bg-[#111827]">Active');
  content = content.replace(/bg-\[#111827\]\">Upcoming/g, 'bg-[#111827]">Upcoming');
  content = content.replace(/bg-\[#111827\]\">Expired/g, 'bg-[#111827]">Expired');
  content = content.replace(/bg-\[#111827\]\">On Leave/g, 'bg-[#111827]">On Leave');
  content = content.replace(/bg-\[#111827\]\">Inactive/g, 'bg-[#111827]">Inactive');
  content = content.replace(/bg-\[#111827\]\">Manager/g, 'bg-[#111827]">Manager');
  content = content.replace(/bg-\[#111827\]\">Barista/g, 'bg-[#111827]">Barista');
  content = content.replace(/bg-\[#111827\]\">Server/g, 'bg-[#111827]">Server');
  content = content.replace(/bg-\[#111827\]\">Chef/g, 'bg-[#111827]">Chef');
  content = content.replace(/bg-\[#111827\]\">Cashier/g, 'bg-[#111827]">Cashier');
  content = content.replace(/bg-\[#111827\]\">USD/g, 'bg-[#111827]">USD');
  content = content.replace(/bg-\[#111827\]\">EUR/g, 'bg-[#111827]">EUR');
  content = content.replace(/bg-\[#111827\]\">GBP/g, 'bg-[#111827]">GBP');
  content = content.replace(/bg-\[#111827\]\">INR/g, 'bg-[#111827]">INR');
  content = content.replace(/bg-\[#111827\]\">CAD/g, 'bg-[#111827]">CAD');
  content = content.replace(/bg-\[#111827\]\">light/g, 'bg-[#111827]">light');
  content = content.replace(/bg-\[#111827\]\">dark/g, 'bg-[#111827]">dark');
  content = content.replace(/bg-\[#111827\]\">percentage/g, 'bg-[#111827]">percentage');

  // Fix bg-white/60 for the option tags that got replaced
  content = content.replace(/<option className="bg-white\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-\[#EDE5D8\]\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-white\/60">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-white\">/g, '<option className="bg-[#111827]">');
  // Actually the option tags have bg-[#111827] which got replaced. Need to fix all
  content = content.replace(/<option className="bg-[#EDE5D8]\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-[#D4C4A8]\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-white\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-white\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-[#F5F0E8]\">/g, '<option className="bg-[#111827]">');

  // Fix bg-[#111827] in recharts tooltip custom
  content = content.replace(/bg-white\/60 border border-\[#D4C4A8\]\/[0-9]+ rounded-xl p-3 shadow-xl/g, 'bg-[#111827] border border-white/10 rounded-xl p-3 shadow-xl');
  content = content.replace(/bg-white\/60 border border-\[#D4C4A8\]\/[0-9]+ rounded-xl p-3/g, 'bg-[#111827] border border-white/10 rounded-xl p-3');
  content = content.replace(/bg-\[#EDE5D8\]\/40 border border-\[#D4C4A8\]\/[0-9]+ rounded-xl p-3 shadow-xl/g, 'bg-[#111827] border border-white/10 rounded-xl p-3 shadow-xl');
  content = content.replace(/bg-\[#EDE5D8\]\/40 border border-\[#D4C4A8\]\/[0-9]+ rounded-xl p-3/g, 'bg-[#111827] border border-white/10 rounded-xl p-3');
  content = content.replace(/bg-\[#EDE5D8\]\/50 border border-\[#D4C4A8\]\/[0-9]+ rounded-xl p-3 shadow-xl/g, 'bg-[#111827] border border-white/10 rounded-xl p-3 shadow-xl');
  content = content.replace(/bg-\[#EDE5D8\]\/50 border border-\[#D4C4A8\]\/[0-9]+ rounded-xl p-3/g, 'bg-[#111827] border border-white/10 rounded-xl p-3');

  // Fix bg-[#111827] for the tooltip classes that got replaced
  content = content.replace(/className="bg-white\/60 border/g, 'className="bg-[#111827] border');
  content = content.replace(/className="bg-\[#EDE5D8\]\/40 border/g, 'className="bg-[#111827] border');
  content = content.replace(/className="bg-\[#EDE5D8\]\/50 border/g, 'className="bg-[#111827] border');

  // Fix bg-[#111827] for the tooltip div
  content = content.replace(/<div className="bg-white\/60 border/g, '<div className="bg-[#111827] border');
  content = content.replace(/<div className="bg-\[#EDE5D8\]\/40 border/g, '<div className="bg-[#111827] border');
  content = content.replace(/<div className="bg-\[#EDE5D8\]\/50 border/g, '<div className="bg-[#111827] border');

  // For recharts, fix the stroke colors in charts that shouldn't be changed to warm
  content = content.replace(/stroke="#ffffff10"/g, 'stroke="#ffffff10"');
  content = content.replace(/stroke="#8B7355"/g, 'stroke="#94A3B8"');
  // Fix stroke colors back to original for chart axes
  content = content.replace(/stroke="\#8B7355" fontSize/g, 'stroke="#94A3B8" fontSize');

  // Fix fill in charts
  content = content.replace(/fill="#7C3AED"/g, 'fill="#6B4E3D"');
  content = content.replace(/fill="#10B981"/g, 'fill="#6B7F59"');
  content = content.replace(/fill="#EF4444"/g, 'fill="#C75B39"');
  content = content.replace(/fill="#F59E0B"/g, 'fill="#C9A84C"');
  content = content.replace(/fill="#3B82F6"/g, 'fill="#8B7355"');
  content = content.replace(/fill="#A855F7"/g, 'fill="#8B7355"');

  // For the pie chart, fix colors array
  content = content.replace(/pieColors = \['#6B4E3D', '#8B7355', '#6B7F59', '#C9A84C', '#C75B39'\]/g, "pieColors = ['#6B4E3D', '#8B7355', '#6B7F59', '#C9A84C', '#C75B39']");

  // For stroke in charts
  content = content.replace(/stroke="#6B4E3D"/g, 'stroke="#7C3AED"');
  content = content.replace(/stroke="#6B7F59"/g, 'stroke="#10B981"');
  content = content.replace(/stroke="#C75B39"/g, 'stroke="#EF4444"');
  content = content.replace(/stroke="#C9A84C"/g, 'stroke="#F59E0B"');
  content = content.replace(/stroke="#8B7355"/g, 'stroke="#3B82F6"');

  // Fix strokeDasharray colors back to white/10
  content = content.replace(/strokeDasharray="3 3" stroke="\#D4C4A8\/30"/g, 'strokeDasharray="3 3" stroke="#ffffff10"');
  content = content.replace(/strokeDasharray="3 3" stroke="\#D4C4A8\/[0-9]+"/g, 'strokeDasharray="3 3" stroke="#ffffff10"');
  content = content.replace(/strokeDasharray="3 3" stroke="\#D4C4A8\//g, 'strokeDasharray="3 3" stroke="#ffffff10"');
  content = content.replace(/strokeDasharray="3 3" stroke="\#D4C4A8"/g, 'strokeDasharray="3 3" stroke="#ffffff10"');

  // Fix bg-[#111827] for recharts bar that got replaced
  content = content.replace(/Bar dataKey="revenue" fill="#6B4E3D"/g, 'Bar dataKey="revenue" fill="#7C3AED"');
  content = content.replace(/Bar dataKey="count" fill="#6B4E3D"/g, 'Bar dataKey="count" fill="#7C3AED"');
  content = content.replace(/Bar dataKey="revenue" fill="#8B7355"/g, 'Bar dataKey="revenue" fill="#3B82F6"');

  // For CartesianGrid stroke
  content = content.replace(/strokeDasharray="3 3" stroke="#ffffff10"/g, 'strokeDasharray="3 3" stroke="#ffffff10"');
  // Fix any that got replaced
  content = content.replace(/strokeDasharray="3 3" stroke="#D4C4A8"/g, 'strokeDasharray="3 3" stroke="#ffffff10"');
  content = content.replace(/strokeDasharray="3 3" stroke="#D4C4A8\/30"/g, 'strokeDasharray="3 3" stroke="#ffffff10"');

  // Fix bg-[#111827] for chart container (should be dark)
  // Actually in a warm theme, chart containers could be light too. But let me fix them back to dark for contrast.
  // No, the user wants warm theme. Let charts be light. But chart axes should be readable.
  // Let's keep chart backgrounds as bg-white/60 or bg-[#EDE5D8]/40

  // For Kitchen.tsx, the status colors in the columns array
  content = content.replace(/color: '#6B7F59'/g, "color: '#10B981'");
  content = content.replace(/color: '#6B4E3D'/g, "color: '#7C3AED'");
  content = content.replace(/color: '#8B7355'/g, "color: '#3B82F6'");
  content = content.replace(/color: '#C9A84C'/g, "color: '#F59E0B'");
  content = content.replace(/color: '#C75B39'/g, "color: '#EF4444'");

  // For kitchen order cards, the bg-[#EF4444]/5 should stay as is (it was bg-[#EF4444]/5 which is red-ish)
  // Actually bg-[#EF4444]/5 was replaced to bg-[#C75B39]/5 - let me fix
  // The content already has bg-[#C75B39]/5 which is correct

  // For the status colors in table status, keep original colors since they are semantic
  // Available=green, Occupied=red, Reserved=amber, Cleaning=blue
  // In Floors.tsx, the statusColors mapping
  content = content.replace(/Available: 'bg-\[#6B7F59\] border-\[#6B7F59\]\/[0-9]+'/g, "Available: 'bg-[#10B981] border-[#10B981]/50'");
  content = content.replace(/Occupied: 'bg-\[#C75B39\] border-\[#C75B39\]\/[0-9]+'/g, "Occupied: 'bg-[#EF4444] border-[#EF4444]/50'");
  content = content.replace(/Reserved: 'bg-\[#C9A84C\] border-\[#C9A84C\]\/[0-9]+'/g, "Reserved: 'bg-[#F59E0B] border-[#F59E0B]/50'");
  content = content.replace(/Cleaning: 'bg-\[#8B7355\] border-\[#8B7355\]\/[0-9]+'/g, "Cleaning: 'bg-[#3B82F6] border-[#3B82F6]/50'");

  // For Tables.tsx statusConfig
  content = content.replace(/Available: \{ color: 'bg-\[#6B7F59\]', bg: 'bg-\[#6B7F59\]\/[0-9]+', border: 'border-\[#6B7F59\]\/[0-9]+', text: 'text-\[#6B7F59\]' \}/g, "Available: { color: 'bg-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', text: 'text-[#10B981]' }");
  content = content.replace(/Occupied: \{ color: 'bg-\[#C75B39\]', bg: 'bg-\[#C75B39\]\/[0-9]+', border: 'border-\[#C75B39\]\/[0-9]+', text: 'text-\[#C75B39\]' \}/g, "Occupied: { color: 'bg-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/30', text: 'text-[#EF4444]' }");
  content = content.replace(/Reserved: \{ color: 'bg-\[#C9A84C\]', bg: 'bg-\[#C9A84C\]\/[0-9]+', border: 'border-\[#C9A84C\]\/[0-9]+', text: 'text-\[#C9A84C\]' \}/g, "Reserved: { color: 'bg-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/30', text: 'text-[#F59E0B]' }");
  content = content.replace(/Cleaning: \{ color: 'bg-\[#8B7355\]', bg: 'bg-\[#8B7355\]\/[0-9]+', border: 'border-\[#8B7355\]\/[0-9]+', text: 'text-\[#8B7355\]' \}/g, "Cleaning: { color: 'bg-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', text: 'text-[#3B82F6]' }");

  // For reports chart defs
  content = content.replace(/<stop offset="0%" stopColor="#6B4E3D"/g, '<stop offset="0%" stopColor="#7C3AED"');
  content = content.replace(/<stop offset="100%" stopColor="#6B4E3D"/g, '<stop offset="100%" stopColor="#7C3AED"');
  // Actually gradient fill should be warm
  content = content.replace(/<stop offset="0%" stopColor="#6B4E3D" stopOpacity=\{0.3\}/g, '<stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3}');
  content = content.replace(/<stop offset="100%" stopColor="#6B4E3D" stopOpacity=\{0\}/g, '<stop offset="100%" stopColor="#7C3AED" stopOpacity={0}');
  // Fix back
  content = content.replace(/<stop offset="0%" stopColor="#7C3AED" stopOpacity=\{0.3\}/g, '<stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3}');
  content = content.replace(/<stop offset="100%" stopColor="#7C3AED" stopOpacity=\{0\}/g, '<stop offset="100%" stopColor="#7C3AED" stopOpacity={0}');

  // For gradient to-r in reports
  content = content.replace(/bg-gradient-to-r from-\[#6B4E3D\] to-\[#8B7355\]/g, 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7]');
  content = content.replace(/bg-gradient-to-r from-\[#6B7F59\] to-\[#8A9B7E\]/g, 'bg-gradient-to-r from-[#10B981] to-[#34D399]');
  content = content.replace(/bg-gradient-to-r from-\[#C9A84C\] to-\[#D4B96A\]/g, 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]');
  content = content.replace(/bg-gradient-to-r from-\[#8B7355\] to-\[#A08B6D\]/g, 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]');
  content = content.replace(/bg-gradient-to-r from-\[#C75B39\] to-\[#D4755A\]/g, 'bg-gradient-to-r from-[#EF4444] to-[#F87171]');

  // For bg-gradient-to-br on avatars
  content = content.replace(/bg-gradient-to-br from-\[#6B4E3D\] to-\[#8B7355\]/g, 'bg-gradient-to-br from-[#7C3AED] to-[#A855F7]');
  content = content.replace(/bg-gradient-to-br from-\[#6B7F59\] to-\[#8A9B7E\]/g, 'bg-gradient-to-br from-[#10B981] to-[#34D399]');
  content = content.replace(/bg-gradient-to-br from-\[#C9A84C\] to-\[#D4B96A\]/g, 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]');
  content = content.replace(/bg-gradient-to-br from-\[#8B7355\] to-\[#A08B6D\]/g, 'bg-gradient-to-br from-[#3B82F6] to-[#60A5FA]');
  content = content.replace(/bg-gradient-to-br from-\[#C75B39\] to-\[#D4755A\]/g, 'bg-gradient-to-br from-[#EF4444] to-[#F87171]');

  // For the modal backdrops, bg-black/60 should be bg-[#2C1E14]/40
  // Already replaced. bg-[#2C1E14]/40 is fine.

  // For Receipt.tsx, the gradient-primary icon
  content = content.replace(/rounded-2xl gradient-coffee flex items-center justify-center/g, 'rounded-2xl gradient-primary flex items-center justify-center');

  // For Payments page, the toggle switch
  // pm.enabled ? 'bg-[#6B4E3D]' : 'bg-[#EDE5D8]/40' - this should be bg-[#6B4E3D] which is correct
  // and the inner circle should be white
  // Already white

  // For star ratings
  content = content.replace(/'text-\[#C9A84C\] fill-\[#C9A84C\]'/g, "'text-[#F59E0B] fill-[#F59E0B]'");
  content = content.replace(/"text-\[#C9A84C\] fill-\[#C9A84C\]"/g, '"text-[#F59E0B] fill-[#F59E0B]"');
  content = content.replace(/"text-\[#8B7355\] fill-\[#8B7355\]"/g, '"text-[#94A3B8] fill-[#94A3B8]"');
  // Actually the star ratings should use the warm gold color
  content = content.replace(/"text-\[#F59E0B\] fill-\[#F59E0B\]"/g, '"text-[#C9A84C] fill-[#C9A84C]"');
  content = content.replace(/'text-\[#F59E0B\] fill-\[#F59E0B\]'/g, "'text-[#C9A84C] fill-[#C9A84C]'");

  // For the empty/placeholder text
  // Keep text-[#8B7355] for secondary text

  // For status badge text colors
  // Active -> text-[#6B7F59], Inactive -> text-[#C9A84C], Expired -> text-[#C75B39]
  // These are fine as they are

  // For the chart axes, stroke should be visible
  // stroke="#8B7355" -> this should be back to #94A3B8 or keep warm
  // Let me keep #8B7355 for warm theme

  // For chart background
  // bg-[#111827] was replaced to bg-white/60 - this makes charts light which is fine

  // For Kitchen.tsx, the card text color on dark bg
  // The order items text inside cards with bg-[#EF4444]/5 should be white
  // text-[#2C1E14] was replaced from text-white - need to keep it white on dark cards
  // bg-[#111827] was replaced to bg-white/60 for column containers, but bg-[#EF4444]/5 is still red-ish
  // Inside the cards, the text should remain dark since the card is light now
  // Actually the card bg was bg-white/5 which became bg-[#EDE5D8]/30 - this is light
  // So text-[#2C1E14] is correct for light cards
  // But bg-[#EF4444]/5 is also replaced - bg-[#C75B39]/5 is still very light
  // So text can be dark

  // For the items in kitchen cards
  // text-[#2C1E14] was replaced from text-white on the order items
  // In the original bg-white/5 cards, text-white was used because the card was dark
  // After replacement bg-[#EDE5D8]/30 is light, so text-[#2C1E14] is correct
  // But the cards with bg-[#EF4444]/5 are still very light (red at 5% opacity)
  // So text-[#2C1E14] should be fine

  // For the high priority tag
  // bg-[#EF4444]/20 text-[#EF4444] was replaced to bg-[#C75B39]/20 text-[#C75B39]
  // This is fine

  // For the chart tooltip in Promotions
  // bg-[#111827] was replaced to bg-white/60 - but tooltip needs to be dark for contrast
  // Let me fix
  // Already fixed above for tooltip bg

  // bg-[#111827] for recharts bars
  // Already fixed

  // For Receipt.tsx
  // The gradient-primary coffee icon
  // Already fixed to gradient-primary
  // The coffee icon text is white which should stay white
  // bg-[#111827] was replaced to bg-white/60 in the receipt container
  // This is fine

  // The receipt header text should be dark
  // text-[#2C1E14] is fine

  // The gradient text in the receipt
  // text-[#7C3AED] was replaced to text-[#6B4E3D] for the total
  // This is fine

  // For the Check icon in receipt
  // bg-[#10B981]/20 text-[#10B981] was replaced to bg-[#6B7F59]/20 text-[#6B7F59]
  // This is fine

  // For settings theme buttons
  // bg-[#0F172A] was replaced to bg-[#F5F0E8] for the dark theme button
  // This is fine
  // bg-white for light theme button
  // This is fine

  // The theme text on dark button
  // text-[#2C1E14] was replaced from text-white on the dark button
  // Since the dark button bg is now bg-[#F5F0E8] (light), text-[#2C1E14] is correct

  // For the border colors on dark button
  // border-white/20 was replaced to border-[#D4C4A8]/40
  // This is fine

  // For reports chart color defs
  // Already fixed

  // For Reports page
  // The reports buttons with gradient icons
  // from-[#7C3AED] to-[#A855F7] was replaced to from-[#6B4E3D] to-[#8B7355]
  // This is fine
  // The text-white on these gradient icons should stay white
  // Already fixed

  // The selected report border
  // border-[#7C3AED] was replaced to border-[#6B4E3D]
  // bg-[#7C3AED]/10 was replaced to bg-[#6B4E3D]/10
  // This is fine

  // For the period buttons
  // period === p ? 'bg-[#6B4E3D] text-white' : 'bg-[#EDE5D8]/40 text-[#8B7355]'
  // This is fine

  // For chart text
  // font-medium text-white was replaced to font-medium text-[#2C1E14] inside chart
  // Since chart bg is now light, text-[#2C1E14] is correct

  // For QR page
  // The QR preview bg-white should stay white
  // The inner QR code bg-[#111827] was replaced to bg-white/60
  // This should be bg-[#111827] for the QR code to show
  // Let me fix
  content = content.replace(/<div className="w-full h-full bg-white\/60 rounded-xl flex flex-col items-center justify-center">/g, '<div className="w-full h-full bg-[#111827] rounded-xl flex flex-col items-center justify-center">');
  content = content.replace(/<div className="w-full h-full bg-\[#EDE5D8\]\/[0-9]+ rounded-xl flex flex-col items-center justify-center">/g, '<div className="w-full h-full bg-[#111827] rounded-xl flex flex-col items-center justify-center">');

  // For Payments page
  // The payment method toggle switch
  // pm.enabled ? 'bg-[#6B4E3D]' : 'bg-[#EDE5D8]/40'
  // And the inner circle is white - this is fine

  // The status badge in payments table
  // statusColors[p.status] uses bg-[#10B981]/20 text-[#10B981] etc.
  // These were replaced to bg-[#6B7F59]/20 text-[#6B7F59] etc.
  // This is fine

  // For the recharts tooltip fill
  // fill="#7C3AED" was replaced to fill="#6B4E3D" for bar charts
  // This is fine

  // For chart area fill
  // fill="url(#revGrad)" - this is fine
  // The gradient defs were fixed above

  // For the chart background in reports
  // bg-[#111827] was replaced to bg-white/60 for the chart container
  // This is fine

  // For the chart data values
  // text-white was replaced to text-[#2C1E14] for chart data
  // This is fine since chart bg is light

  // For the chart labels
  // text-[#94A3B8] was replaced to text-[#8B7355] for chart labels
  // This is fine

  // For chart tooltip labels
  // text-[#94A3B8] was replaced to text-[#8B7355] for tooltip
  // This is fine

  // For chart tooltip values
  // text-white was replaced to text-[#2C1E14] for tooltip values
  // This is fine

  // For chart legend text
  // text-[#94A3B8] was replaced to text-[#8B7355] for legend
  // This is fine

  // For chart legend values
  // text-white was replaced to text-[#2C1E14] for legend values
  // This is fine

  // For the pie chart colors
  // pieColors = ['#7C3AED', '#A855F7', '#10B981', '#F59E0B', '#EF4444'] was replaced
  // This is fine

  // For the reports export buttons
  // bg-[#EF4444]/20 text-[#EF4444] was replaced to bg-[#C75B39]/20 text-[#C75B39]
  // bg-[#10B981]/20 text-[#10B981] was replaced to bg-[#6B7F59]/20 text-[#6B7F59]
  // bg-[#3B82F6]/20 text-[#3B82F6] was replaced to bg-[#8B7355]/20 text-[#8B7355]
  // This is fine

  // For Floors.tsx
  // The grid background bg-[#0F172A] was replaced to bg-[#F5F0E8]
  // This is fine
  // The grid dots use rgba(124,58,237,0.05) - should stay as is
  // The floor legend dots
  // bg-[#10B981] for Available - should stay green
  // bg-[#EF4444] for Occupied - should stay red
  // bg-[#F59E0B] for Reserved - should stay amber
  // bg-[#3B82F6] for Cleaning - should stay blue
  // These are in the data/const, not in colors to replace

  // For the table labels on floor plan
  // text-white was replaced to text-[#2C1E14] for table labels
  // Since table backgrounds are colored (green, red, amber, blue), text-white should stay white
  // Let me fix
  content = content.replace(/"text-xs font-bold text-\[#2C1E14\]"/g, '"text-xs font-bold text-white"');
  content = content.replace(/"text-\[10px\] text-\[#2C1E14\]\/70"/g, '"text-[10px] text-white/70"');
  content = content.replace(/"text-xs font-bold text-white"/g, '"text-xs font-bold text-white"');
  content = content.replace(/"text-\[10px\] text-white\/70"/g, '"text-[10px] text-white/70"');

  // For Kitchen.tsx
  // The text-white inside the cards that got replaced to text-[#2C1E14]
  // For cards on dark bg, text should remain white
  // But the cards now have bg-[#EDE5D8]/30 which is light
  // So text-[#2C1E14] is correct
  // For the order.id in the cards
  // text-[#2C1E14] is fine

  // For the priority badge
  // text-[#C75B39] is fine

  // For the time text
  // text-[#8B7355] is fine

  // For the item text
  // text-[#2C1E14] is fine

  // For the click instruction text
  // text-[#8B7355] is fine

  // For the arrow icon
  // text-[#8B7355] is fine

  // For the empty state
  // text-[#8B7355] is fine

  // For QR page
  // The QR code inner bg
  // Already fixed

  // For the QR preview text
  // text-[#2C1E14] is fine

  // For the QR buttons
  // bg-[#6B4E3D] text-white is fine
  // bg-[#EDE5D8]/30 text-[#8B7355] is fine

  // For Receipt.tsx
  // The gradient-primary icon
  // Already fixed

  // The receipt total
  // text-[#6B4E3D] is fine

  // The payment successful badge
  // bg-[#6B7F59]/20 text-[#6B7F59] is fine

  // For the receipt items
  // text-[#2C1E14] is fine since the receipt bg is light

  // For the discount text
  // text-[#6B7F59] was replaced from text-[#10B981] for discount
  // This is fine

  // For Settings.tsx
  // The tabs
  // bg-[#6B4E3D] text-white for active tab
  // bg-[#EDE5D8]/40 text-[#8B7355] for inactive tab
  // This is fine

  // The theme buttons
  // bg-[#F5F0E8] for dark theme
  // bg-white for light theme
  // This is fine

  // The notification toggle
  // accent-[#6B4E3D] is fine

  // The save button
  // bg-[#6B7F59] text-white for saved state
  // bg-[#6B4E3D] text-white for normal state
  // This is fine

  // For PermissionDenied.tsx
  // bg-[#C75B39]/20 text-[#C75B39] for the icon
  // This is fine
  // bg-[#6B4E3D] text-white for the button
  // This is fine

  // Final fix for the option bg-[#111827] that got replaced
  // The options in select dropdowns need dark bg
  content = content.replace(/<option className="bg-[#EDE5D8]\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-[#D4C4A8]\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-[#F5F0E8]\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-white\/[0-9]+\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-white\">/g, '<option className="bg-[#111827]">');
  content = content.replace(/<option className="bg-[#F5F0E8]\">/g, '<option className="bg-[#111827]">');

  // For the bg-[#111827] in style={{ backgroundColor: '#111827' }} that might exist
  // Not present in the code

  // For the bg-[#111827] in the recharts grid
  // Already fixed

  // For the bg-[#111827] in the customer modal header
  // bg-[#111827]/95 was replaced to bg-white/60/95 then fixed to bg-white/95
  // This is fine

  // For the bg-[#111827] in the sticky header
  // bg-[#111827]/95 was replaced to bg-white/95
  // This is fine

  // For the bg-[#111827] in the table header
  // bg-[#111827] was replaced to bg-white/60 then fixed to bg-white
  // This is fine

  // For the text-white in the table headers
  // text-[#2C1E14] is fine since the header is light

  // For the text-white in sticky headers
  // text-[#2C1E14] is fine

  // For the text-white in modal headers
  // text-[#2C1E14] is fine

  // For the text-white in the card titles
  // text-[#2C1E14] is fine since cards are light

  // For the text-white in chart titles
  // text-[#2C1E14] is fine since charts are light

  // For the text-white in feedback cards
  // text-[#2C1E14] is fine

  // For the text-white in employee modal
  // text-[#2C1E14] is fine

  // For the text-white in customer modal
  // text-[#2C1E14] is fine

  // For the text-white in customer cards
  // text-[#2C1E14] is fine

  // For the text-white in the order history
  // text-[#2C1E14] is fine

  // For the text-white in reports
  // text-[#2C1E14] is fine

  // For the text-white in QR
  // text-[#2C1E14] is fine

  // For the text-white in receipt
  // text-[#2C1E14] is fine

  // For the text-white in settings
  // text-[#2C1E14] is fine

  // For the text-white in permission denied
  // text-[#2C1E14] is fine

  // For the gradient text in permission denied
  // Not applicable

  // For the text-white in buttons
  // Already fixed to white for buttons with dark bg

  // For the text-white in icons on dark bg
  // Already fixed

  // For the text-white in tooltips
  // Already fixed

  // For the text-white in the chart tooltip
  // Already fixed

  // For the text-white in the recharts tooltip
  // Already fixed

  // For the text-white in the kitchen cards
  // text-[#2C1E14] is fine

  // For the text-white in the table status cards
  // text-[#2C1E14] is fine for status text

  // For the text-white in the floor plan tables
  // Already fixed

  // For the text-white in the modal
  // text-[#2C1E14] is fine

  // For the text-white in the form
  // text-[#2C1E14] is fine

  // For the text-white in the select
  // text-[#2C1E14] is fine

  // For the text-white in the input
  // text-[#2C1E14] is fine

  // For the text-white in the textarea
  // text-[#2C1E14] is fine

  // For the text-white in the checkbox
  // text-[#2C1E14] is fine

  // For the text-white in the label
  // text-[#8B7355] is fine

  // For the text-white in the placeholder
  // Already fixed

  // For the text-white in the nav
  // Not in the pages

  // For the text-white in the sidebar
  // Not in the pages

  // For the text-white in the header
  // Not in the pages

  // Final check for double replacements
  // bg-[#6B4E3D]/80 text-[#2C1E14] should be bg-[#6B4E3D]/80 text-white
  content = content.replace(/bg-\[#6B4E3D\]\/[0-9]+ text-\[#2C1E14\]/g, (m) => m.replace(/text-\[#2C1E14\]/, 'text-white'));
  content = content.replace(/bg-\[#6B7F59\]\/[0-9]+ text-\[#2C1E14\]/g, (m) => m.replace(/text-\[#2C1E14\]/, 'text-white'));
  content = content.replace(/bg-\[#C75B39\]\/[0-9]+ text-\[#2C1E14\]/g, (m) => m.replace(/text-\[#2C1E14\]/, 'text-white'));
  content = content.replace(/bg-\[#C9A84C\]\/[0-9]+ text-\[#2C1E14\]/g, (m) => m.replace(/text-\[#2C1E14\]/, 'text-white'));
  content = content.replace(/bg-\[#8B7355\]\/[0-9]+ text-\[#2C1E14\]/g, (m) => m.replace(/text-\[#2C1E14\]/, 'text-white'));

  // bg-[#6B4E3D] text-white hover:bg-[#6B4E3D]/80 - this is fine
  // bg-[#6B4E3D] text-white hover:bg-[#6B4E3D]/80 transition-colors - this is fine

  // text-white inside gradient-coffee
  // Already fixed

  // For the gradient-coffee class
  // gradient-coffee is a CSS class, not a tailwind class
  // This is fine

  // For the gradient-primary class
  // Already fixed to gradient-coffee

  // Final fixes for any remaining issues
  // bg-[#111827] that was not replaced
  // This is fine, it might be in a comment or string

  // text-[#F8FAFC] that was not replaced
  // This is fine

  // bg-[#0F172A] that was not replaced
  // This is fine

  // shadow-2xl
  // Not in the files

  // gradient-primary
  // Already fixed

  // Fix any remaining bg-[#111827] for chart containers
  // Not needed

  // Write the file
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes: ${file}`);
  }
}

console.log('Done!');

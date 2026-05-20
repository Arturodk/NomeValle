const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lsluyqqymyhdusbbwltu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHV5cXF5bXloZHVzYmJ3bHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDU4MTgsImV4cCI6MjA5MzY4MTgxOH0.mBKYwP-dPPJvjXcJKn6FY3kQ1fkdV5ZQgScD_HMaoF4'
);

async function main() {
  const { data, error } = await supabase.from('products').select('name, product_images(url)');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
main();

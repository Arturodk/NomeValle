const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lsluyqqymyhdusbbwltu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHV5cXF5bXloZHVzYmJ3bHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMDU4MTgsImV4cCI6MjA5MzY4MTgxOH0.mBKYwP-dPPJvjXcJKn6FY3kQ1fkdV5ZQgScD_HMaoF4'
);

async function main() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error("Error:", error);
  else console.log("Buckets:", data.map(b => b.name));
}
main();

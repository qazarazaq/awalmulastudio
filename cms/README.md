# 8bit lab CMS

Deploy via Vercel > Add New Project > import qazarazaq/awalmulastudio.
Set Root Directory to `cms`, Framework Preset to `Other`, and Build Command to none.

Supabase authentication: create an email/password user in Auth > Users, then add that user's UUID to `public.cms_admins` through the SQL editor. Only approved admin users can change content.

The public website reads Supabase data only after its frontend integration branch has been tested and merged. This CMS folder can be deployed independently of the public site.

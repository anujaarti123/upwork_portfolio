-- Make cms-assets bucket publicly readable (run in Supabase SQL Editor)
-- Also ensure bucket is set to PUBLIC in Storage dashboard

-- Allow public read on all files in cms-assets bucket
CREATE POLICY "Public read cms-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'cms-assets');

-- Allow authenticated users to upload/update/delete
CREATE POLICY "Admin upload cms-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cms-assets');

CREATE POLICY "Admin update cms-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cms-assets');

CREATE POLICY "Admin delete cms-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cms-assets');

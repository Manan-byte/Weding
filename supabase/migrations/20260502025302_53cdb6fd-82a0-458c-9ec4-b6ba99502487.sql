ALTER TABLE public.wishes ADD COLUMN IF NOT EXISTS owner_token text;

CREATE POLICY "Anyone can update wishes"
ON public.wishes
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete wishes"
ON public.wishes
FOR DELETE
USING (true);
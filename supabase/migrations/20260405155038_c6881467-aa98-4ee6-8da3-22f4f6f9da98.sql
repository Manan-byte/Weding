
-- Create wishes table
CREATE TABLE public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- Everyone can read all wishes
CREATE POLICY "Anyone can view wishes"
  ON public.wishes FOR SELECT
  USING (true);

-- Anyone can insert wishes (no auth required for wedding guests)
CREATE POLICY "Anyone can insert wishes"
  ON public.wishes FOR INSERT
  WITH CHECK (true);

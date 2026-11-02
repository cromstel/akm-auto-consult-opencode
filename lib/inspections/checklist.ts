import { z } from 'zod';

/**
 * Structured inspection checklist, stored as JSON in
 * Inspection.checklistData (String column). Parsing is explicit and
 * fail-closed: malformed data never reaches domain logic.
 */
export const checklistItemSchema = z.object({
  id: z.string().min(1),
  section: z.string().min(1),
  label: z.string().min(1),
  status: z.enum(['pass', 'fail', 'na', 'pending']),
  note: z.string().max(2000).optional(),
});

export const checklistSchema = z.object({
  items: z.array(checklistItemSchema).max(200),
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type Checklist = z.infer<typeof checklistSchema>;

export function parseChecklist(raw: string): Checklist {
  const json: unknown = JSON.parse(raw);
  const parsed = checklistSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error('Invalid checklist data');
  }
  return parsed.data;
}

import { z } from 'zod'

export const logsValidationSchema = z.object({
  query: z.object({
    startDate: z.string()
      .datetime({ message: 'Start date must be a valid ISO 8601 date' })
      .optional()
      .refine((val) => !val || val.endsWith('Z'), {
        message: 'Start date must explicitly end with Z to indicate UTC'
      }),
    endDate: z.string()
      .datetime({ message: 'End date must be a valid ISO 8601 date' })
      .optional()
      .refine((val) => !val || val.endsWith('Z'), {
        message: 'End date must explicitly end with Z to indicate UTC'
      }),
    limit: z.coerce.number()
      .int()
      .min(1, { message: 'Limit must be at least 1' })
      .max(1000, { message: 'Limit cannot exceed 1000' })
      .optional()
      .default(100),
    offset: z.coerce.number()
      .int()
      .min(0, { message: 'Offset must be 0 or greater' })
      .optional()
      .default(0)
  }).refine((data) => {
    if (data.endDate && data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
      return false
    }
    return true
  }, { message: 'End date must be after start date' })
})

export type AccessLogsQuery = z.infer<typeof logsValidationSchema>

import { describe, it, expect, vi } from 'vitest'
import { synchronizeWithStorageJob } from '../synchronize-with-storage.js'
import { synchronizeWithStorage } from '../../../service/current-rates.js'

vi.mock('../../../service/current-rates.js')
vi.mock('../../../utils/logger.js')

describe('synchronizeWithStorageJob', () => {
  it('successfully synchronizes with storage', async () => {
    await synchronizeWithStorageJob()

    expect(synchronizeWithStorage).toHaveBeenCalled()
  })
})

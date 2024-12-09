import { describe, it, expect, vi } from 'vitest'
import { syncRatesCron } from '../index.js'
import { synchronizeWithStorage } from '../../service/current-rates.js'

vi.mock('../../service/current-rates.js', () => ({
  synchronizeWithStorage: vi.fn()
}))

describe('syncRatesCron', () => {
  it('should call synchronizeWithStorage when job runs', async () => {
    await syncRatesCron.fireOnTick()
    expect(synchronizeWithStorage).toHaveBeenCalled()
  })

})

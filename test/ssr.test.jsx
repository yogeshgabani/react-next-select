// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { renderToString } from 'react-dom/server'
import { Select } from '../src/index.js'

const GROUPS = [
  { value: 'x', label: 'Loose' },
  { label: 'Fruits', options: [{ value: 'a', label: 'Apple', isDisabled: true }, { value: 'b', label: 'Banana' }] },
]

describe('server rendering', () => {
  it('renders without window/document', () => {
    expect(typeof window).toBe('undefined')
    const html = renderToString(
      <Select
        options={GROUPS}
        color="purple"
        variant="filled"
        size="lg"
        isInvalid
        isCreatable
        showSelectAll
        isMulti
        highlightMatch
        menuPortalTarget={null}
        menuPlacement="auto"
      />,
    )
    expect(html).toContain('rns--filled rns--size-lg rns--is-multi rns--is-invalid')
    expect(html).toContain('--rns-accent:168 85 247')
    expect(html).toContain('aria-invalid="true"')
  })

  it('renders an open menu with groups, disabled options and checkmarks', () => {
    const html = renderToString(
      <Select options={GROUPS} menuIsOpen showCheckmark value={GROUPS[1].options[1]} id="t" />,
    )
    expect(html).toContain('role="group" aria-labelledby="t-group-1"')
    expect(html).toMatch(/rns__option--disabled[^"]*"[^>]*aria-disabled="true"/)
    expect(html).toContain('rns__option-check')
    expect(html).toContain('rns__menu rns__menu--bottom')
  })

  it('adds nothing extra by default', () => {
    const html = renderToString(<Select options={GROUPS} />)
    expect(html).toContain('class="rns__wrapper rns__wrapper"')
    expect(html).not.toContain('--rns-')
  })
})

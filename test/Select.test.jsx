import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Select } from '../src/index.js'

afterEach(cleanup)

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
]

const control = () => screen.getByRole('combobox')
const input = () => document.querySelector('.rns__input')
const optionLabels = () => screen.queryAllByRole('option').map((o) => o.textContent)
const focused = () => document.querySelector('.rns__option--focused')?.textContent

async function openMenu(user) {
  await user.click(control())
  return screen.getByRole('listbox')
}

describe('basics', () => {
  it('opens, selects and closes (single)', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={FRUITS} onChange={onChange} />)
    await openMenu(user)
    expect(optionLabels()).toEqual(['Apple', 'Banana', 'Cherry', 'Grape'])
    await user.click(screen.getByText('Banana'))
    expect(onChange).toHaveBeenCalledWith(FRUITS[1], { action: 'select-option', option: FRUITS[1] })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(document.querySelector('.rns__single-value').textContent).toBe('Banana')
  })

  it('filters while typing and selects with Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={FRUITS} onChange={onChange} />)
    await openMenu(user)
    await user.keyboard('ap')
    expect(optionLabels()).toEqual(['Apple', 'Grape'])
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onChange.mock.calls[0][0]).toEqual(FRUITS[3])
  })

  it('sets aria-invalid and the invalid class', () => {
    render(<Select options={FRUITS} isInvalid />)
    expect(control().getAttribute('aria-invalid')).toBe('true')
    expect(document.querySelector('.rns__wrapper').className).toContain('rns--is-invalid')
  })

  it('writes color props as CSS variables on the wrapper', () => {
    render(<Select options={FRUITS} color="purple" variant="filled" size="lg" radius={14} />)
    const wrapper = document.querySelector('.rns__wrapper')
    expect(wrapper.style.getPropertyValue('--rns-accent')).toBe('168 85 247')
    expect(wrapper.style.getPropertyValue('--rns-radius')).toBe('14px')
    expect(wrapper.className).toContain('rns--filled')
    expect(wrapper.className).toContain('rns--size-lg')
  })

  it.each(['solid', 'elevated', 'glass', 'gradient', 'glow', 'pill', 'flushed', 'ghost'])(
    'adds the %s variant class',
    (variant) => {
      render(<Select options={FRUITS} variant={variant} />)
      expect(document.querySelector('.rns__wrapper').className).toContain(`rns--${variant}`)
    },
  )

  it('adds no variant class for the default outline', () => {
    render(<Select options={FRUITS} variant="outline" />)
    expect(document.querySelector('.rns__wrapper').className).not.toMatch(/rns--(outline|filled)/)
  })
})

describe('disabled options', () => {
  const PLANS = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team', isDisabled: true },
    { value: 'biz', label: 'Business' },
    { value: 'ent', label: 'Enterprise', isDisabled: true },
  ]

  it('skips disabled options with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Select options={PLANS} />)
    await openMenu(user)
    expect(focused()).toBe('Free')
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(focused()).toBe('Business')
    await user.keyboard('{ArrowDown}')
    expect(focused()).toBe('Business')
    await user.keyboard('{End}')
    expect(focused()).toBe('Business')
    await user.keyboard('{ArrowUp}')
    expect(focused()).toBe('Pro')
  })

  it('ignores clicks on disabled options', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={PLANS} onChange={onChange} />)
    await openMenu(user)
    const team = screen.getByText('Team')
    expect(team.getAttribute('aria-disabled')).toBe('true')
    await user.click(team)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('accepts a custom isOptionDisabled', async () => {
    const user = userEvent.setup()
    render(<Select options={FRUITS} isOptionDisabled={(o) => o.value !== 'cherry'} />)
    await openMenu(user)
    expect(focused()).toBe('Cherry')
  })
})

describe('grouped options', () => {
  const GROUPS = [
    { label: 'Fruits', options: [{ value: 'a', label: 'Apple' }, { value: 'b', label: 'Banana' }] },
    { label: 'Veg', options: [{ value: 'c', label: 'Carrot' }, { value: 'p', label: 'Pea' }] },
  ]

  it('renders labelled groups and moves across them', async () => {
    const user = userEvent.setup()
    render(<Select options={GROUPS} />)
    await openMenu(user)
    const groups = screen.getAllByRole('group')
    expect(groups.map((g) => document.getElementById(g.getAttribute('aria-labelledby')).textContent)).toEqual([
      'Fruits',
      'Veg',
    ])
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(focused()).toBe('Carrot')
  })

  it('filters inside groups', async () => {
    const user = userEvent.setup()
    render(<Select options={GROUPS} />)
    await openMenu(user)
    await user.keyboard('pe')
    expect(screen.getAllByRole('group')).toHaveLength(1)
    expect(optionLabels()).toEqual(['Pea'])
  })
})

describe('multi-select focus', () => {
  it('keeps focus in the input after picking so the keyboard keeps working', async () => {
    const user = userEvent.setup()
    render(<Select options={FRUITS} isMulti />)
    await openMenu(user)
    await user.keyboard('{Enter}')
    expect(document.activeElement).toBe(input())
    // The highlight stays on Apple, so one step down is Banana.
    await user.keyboard('{ArrowDown}{Enter}')
    expect([...document.querySelectorAll('.rns__multi-value__label')].map((c) => c.textContent)).toEqual([
      'Apple',
      'Banana',
    ])
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('still blurs after picking in single mode', async () => {
    const user = userEvent.setup()
    render(<Select options={FRUITS} />)
    await openMenu(user)
    await user.keyboard('{Enter}')
    expect(document.activeElement).not.toBe(input())
  })
})

describe('creatable', () => {
  it('offers a create option only for new text', async () => {
    const user = userEvent.setup()
    render(<Select options={FRUITS} isCreatable />)
    await openMenu(user)
    await user.keyboard('apple')
    expect(optionLabels()).toEqual(['Apple'])
    await user.clear(input())
    await user.keyboard('Mango')
    expect(optionLabels()).toEqual(['Create "Mango"'])
    expect(document.querySelector('.rns__option--create')).not.toBeNull()
  })

  it('selects the new option directly when there is no onCreateOption', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select options={FRUITS} isCreatable isMulti onChange={onChange} />)
    await openMenu(user)
    await user.keyboard('Mango{Enter}')
    expect(onChange).toHaveBeenLastCalledWith([{ value: 'Mango', label: 'Mango', __isNew__: true }], {
      action: 'create-option',
      option: { value: 'Mango', label: 'Mango', __isNew__: true },
    })
  })

  it('hands the text to onCreateOption when provided', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    const onChange = vi.fn()
    render(<Select options={FRUITS} isCreatable onCreateOption={onCreate} onChange={onChange} />)
    await openMenu(user)
    await user.keyboard('  Kiwi  {Enter}')
    expect(onCreate).toHaveBeenCalledWith('Kiwi')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('supports custom labels and validation', async () => {
    const user = userEvent.setup()
    render(
      <Select
        options={FRUITS}
        isCreatable
        formatCreateLabel={(v) => `+ Add ${v}`}
        isValidNewOption={(v) => v.length >= 3}
      />,
    )
    await openMenu(user)
    await user.keyboard('ki')
    expect(optionLabels()).toEqual([])
    await user.keyboard('w')
    expect(optionLabels()).toEqual(['+ Add kiw'])
  })
})

describe('select all + maxSelected', () => {
  function Controlled(props) {
    const [value, setValue] = useState([])
    return <Select options={FRUITS} isMulti value={value} onChange={setValue} {...props} />
  }
  const chips = () => [...document.querySelectorAll('.rns__multi-value__label')].map((c) => c.textContent)

  it('toggles every visible option', async () => {
    const user = userEvent.setup()
    render(<Controlled showSelectAll />)
    await openMenu(user)
    // Highlight starts on the first real option, not on "Select all".
    expect(focused()).toBe('Apple')
    await user.click(screen.getByText('Select all'))
    expect(chips()).toEqual(['Apple', 'Banana', 'Cherry', 'Grape'])
    await user.click(screen.getByText('Clear all'))
    expect(chips()).toEqual([])
  })

  it('only selects the filtered options', async () => {
    const user = userEvent.setup()
    render(<Controlled showSelectAll />)
    await openMenu(user)
    await user.keyboard('ap')
    await user.click(screen.getByText('Select all'))
    expect(chips()).toEqual(['Apple', 'Grape'])
  })

  it('disables the rest once the limit is reached', async () => {
    const user = userEvent.setup()
    render(<Controlled maxSelected={2} />)
    await openMenu(user)
    await user.keyboard('{Enter}{ArrowDown}{Enter}')
    expect(chips()).toEqual(['Apple', 'Banana'])
    const byLabel = (l) => screen.getAllByRole('option').find((o) => o.textContent === l)
    expect(byLabel('Cherry').getAttribute('aria-disabled')).toBe('true')
    expect(byLabel('Apple').getAttribute('aria-disabled')).toBeNull()
    await user.click(byLabel('Cherry'))
    expect(chips()).toEqual(['Apple', 'Banana'])
    // Deselecting frees a slot again.
    await user.click(byLabel('Apple'))
    expect(chips()).toEqual(['Banana'])
    expect(byLabel('Cherry').getAttribute('aria-disabled')).toBeNull()
  })

  it('select all stops at the limit', async () => {
    const user = userEvent.setup()
    render(<Controlled showSelectAll maxSelected={3} />)
    await openMenu(user)
    await user.click(screen.getByText('Select all'))
    expect(chips()).toEqual(['Apple', 'Banana', 'Cherry'])
  })
})

describe('highlight + icons', () => {
  it('marks the matching text', async () => {
    const user = userEvent.setup()
    render(<Select options={FRUITS} highlightMatch />)
    await openMenu(user)
    await user.keyboard('an')
    const marks = [...document.querySelectorAll('mark.rns__highlight')].map((m) => m.textContent)
    expect(marks).toEqual(['an', 'an'])
    expect(optionLabels()).toEqual(['Banana'])
  })

  it('renders icon and description from the option', async () => {
    const user = userEvent.setup()
    const options = [{ value: 'in', label: 'India', icon: '🇮🇳', description: 'Asia' }]
    render(<Select options={options} defaultValue={options[0]} />)
    expect(document.querySelector('.rns__single-value .rns__value-icon').textContent).toBe('🇮🇳')
    await openMenu(user)
    const opt = screen.getByRole('option')
    expect(within(opt).getByText('Asia').className).toBe('rns__option-description')
    expect(opt.querySelector('.rns__option-icon').textContent).toBe('🇮🇳')
  })

  it('leaves rendering to formatOptionLabel when given', async () => {
    const user = userEvent.setup()
    const options = [{ value: 'in', label: 'India', icon: '🇮🇳' }]
    render(<Select options={options} formatOptionLabel={(o) => `> ${o.label}`} />)
    await openMenu(user)
    expect(screen.getByRole('option').textContent).toBe('> India')
    expect(document.querySelector('.rns__option-icon')).toBeNull()
  })
})

describe('async debounce', () => {
  it('waits for a pause in typing', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const loadOptions = vi.fn(async (q) => FRUITS.filter((f) => f.label.toLowerCase().includes(q)))
      render(<Select loadOptions={loadOptions} debounceMs={300} />)
      await openMenu(user)
      expect(loadOptions.mock.calls.map((c) => c[0])).toEqual([''])
      await user.keyboard('che')
      expect(loadOptions).toHaveBeenCalledTimes(1)
      expect(screen.getByText('Loading...')).toBeTruthy()
      await act(async () => {
        vi.advanceTimersByTime(300)
      })
      expect(loadOptions.mock.calls.map((c) => c[0])).toEqual(['', 'che'])
      expect(optionLabels()).toEqual(['Cherry'])
    } finally {
      vi.useRealTimers()
    }
  })

  it('calls on every keystroke without debounceMs', async () => {
    const user = userEvent.setup()
    const loadOptions = vi.fn(async () => [])
    render(<Select loadOptions={loadOptions} />)
    await openMenu(user)
    await user.keyboard('ab')
    expect(loadOptions.mock.calls.map((c) => c[0])).toEqual(['', 'a', 'ab'])
  })
})

describe('menu portal', () => {
  it('renders the menu into the target and keeps it working', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <div style={{ overflow: 'hidden' }} data-testid="box">
        <Select options={FRUITS} color="rose" menuPortalTarget={document.body} onChange={onChange} />
      </div>,
    )
    const listbox = await openMenu(user)
    expect(screen.getByTestId('box').contains(listbox)).toBe(false)
    const portal = listbox.closest('.rns__portal')
    expect(portal.parentElement).toBe(document.body)
    expect(portal.style.position).toBe('fixed')
    expect(portal.style.getPropertyValue('--rns-accent')).toBe('244 63 94')
    await user.click(screen.getByText('Cherry'))
    expect(onChange.mock.calls[0][0]).toEqual(FRUITS[2])
    expect(document.querySelector('.rns__portal')).toBeNull()
  })

  it('closes on an outside click', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">outside</button>
        <Select options={FRUITS} menuPortalTarget={document.body} />
      </>,
    )
    await openMenu(user)
    await user.click(screen.getByText('outside'))
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})


import { useId, useState } from 'react'

import type { CSSProperties } from 'react'

import {
  Sun,
  Moon,
  Home,
  Settings,
  Users,
  Bell,
  Search,
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
  HelpCircle,
} from 'lucide-react'

import type {
  ColorPalette,
  ColorToken,
} from '../../types/theme.types'

import {
  tokenToCssVariable,
} from '../../exporters/cssExporter'

import './ComprehensivePreview.css'

export type PreviewSection =
  | 'all'
  | 'typography'
  | 'buttons'
  | 'forms'
  | 'alerts'
  | 'table'
  | 'dashboard'

interface ComprehensivePreviewProps {

  palette: ColorPalette

  mode: 'light' | 'dark'

  section?: PreviewSection
}

function createCssVariables(
  palette: ColorPalette,
): CSSProperties {

  return Object.fromEntries(
    Object.entries(palette).map(
      ([key, value]) => [
        tokenToCssVariable(
          key as ColorToken,
        ),
        value,
      ],
    ),
  ) as CSSProperties
}

export default function ComprehensivePreview({

  palette,
  mode,
  section = 'all',

}: ComprehensivePreviewProps) {

  const id = useId()

  const [buttonState, setButtonState] =
    useState('default')

  const [activeMenu, setActiveMenu] =
    useState('Dashboard')

  const [selectedRow, setSelectedRow] =
    useState<number | null>(null)

  const [email, setEmail] = useState('')

  const [saved, setSaved] = useState(false)

  const [showTooltip, setShowTooltip] =
    useState(false)

  const menuItems = [
    { label: 'Dashboard', icon: Home },
    { label: 'Customers', icon: Users },
    { label: 'Settings', icon: Settings },
  ]

  const customers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'David Brown',
      email: 'david@example.com',
      status: 'Active',
    },
  ]

  function shouldShow(
    value: PreviewSection,
  ) {

    return section === 'all' ||
      section === value
  }

  return (

    <article
      className="dts-preview"
      style={{
        ...createCssVariables(palette),
        colorScheme: mode,
      }}
    >

      <div className="dts-preview-label">

        {mode === 'light'
          ? <Sun size={18} />
          : <Moon size={18} />
        }

        {mode === 'light'
          ? 'Light Mode'
          : 'Dark Mode'
        }

      </div>

      {/* Navigation and dashboard */}

      {shouldShow('dashboard') && (

        <section className="dts-card">

          <header className="dts-header">

            <strong>Workspace</strong>

            <button
              type="button"
              aria-label="Notifications"
              className="dts-icon-button"
              onClick={() =>
                setSaved(!saved)
              }
            >
              <Bell size={18} />
            </button>

          </header>

          <div className="dts-dashboard">

            <nav
              className="dts-sidebar"
              aria-label={`${mode} sample navigation`}
            >

              {menuItems.map((item) => (

                <button
                  type="button"
                  key={item.label}
                  onClick={() =>
                    setActiveMenu(item.label)
                  }
                  aria-pressed={
                    activeMenu === item.label
                  }
                  className={
                    'dts-menu-item ' +
                    (activeMenu === item.label
                      ? 'is-active'
                      : '')
                  }
                >

                  <item.icon size={15} />

                  {item.label}

                </button>

              ))}

            </nav>

            <div className="dts-dashboard-content">

              <h3 className="dts-heading">
                {activeMenu}
              </h3>

              <p className="dts-muted">
                Monthly overview
              </p>

              <div className="dts-stat">

                <span>Total revenue</span>

                <strong>₹84,250</strong>

                <small className="dts-success-text">
                  +12.5% this month
                </small>

              </div>

              <div
                className="dts-chart"
                role="img"
                aria-label="Sample revenue bar chart"
              >

                {[25, 42, 35, 58, 46, 70, 60]
                  .map((height, index) => (

                    <div
                      key={index}
                      className="dts-chart-bar"
                      style={{
                        height: `${height}px`,
                      }}
                    />

                  ))}

              </div>

            </div>

          </div>

        </section>

      )}

      {/* Typography */}

      {shouldShow('typography') && (

        <section className="dts-card">

          <h2 className="dts-section-name">
            Typography
          </h2>

          <h1 className="dts-title">
            Welcome back
          </h1>

          <h3 className="dts-heading">
            Account preferences
          </h3>

          <p className="dts-subtitle">
            Manage your personal workspace.
          </p>

          <p className="dts-text">
            This is a sample paragraph
            demonstrating the readability
            of your selected color palette.
          </p>

          <p className="dts-muted">
            Last updated 5 minutes ago.
          </p>

          <p className="dts-disabled-text">
            This feature is unavailable.
          </p>

          <a
            href={`#${id}-documentation`}
            className="dts-link"
          >
            Read documentation
          </a>

          <p
            id={`${id}-documentation`}
            className="dts-muted"
          >
            Sample documentation content.
          </p>

          <hr className="dts-divider" />

          <div className="dts-inline">

            <span className="dts-badge">
              New feature
            </span>

            <span className="dts-tooltip-wrapper">

              <button
                type="button"
                className="dts-icon-button"
                aria-label="Theme help"
                aria-describedby={
                  `${id}-tooltip`
                }
                onMouseEnter={() =>
                  setShowTooltip(true)
                }
                onMouseLeave={() =>
                  setShowTooltip(false)
                }
                onFocus={() =>
                  setShowTooltip(true)
                }
                onBlur={() =>
                  setShowTooltip(false)
                }
                onClick={() =>
                  setShowTooltip(true)
                }
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setShowTooltip(false)
                  }
                }}
              >
                <HelpCircle size={18} />
              </button>

              {showTooltip && (

                <span
                  id={`${id}-tooltip`}
                  role="tooltip"
                  className="dts-tooltip"
                >
                  Sample tooltip
                </span>

              )}

            </span>

          </div>

        </section>

      )}

      {/* Buttons */}

      {shouldShow('buttons') && (

        <section className="dts-card">

          <h2 className="dts-section-name">
            Button states
          </h2>

          <label
            htmlFor={`${id}-button-state`}
            className="dts-label"
          >
            Preview state
          </label>

          <select
            id={`${id}-button-state`}
            className="dts-input"
            value={buttonState}
            onChange={(event) =>
              setButtonState(
                event.target.value,
              )
            }
          >

            <option value="default">
              Default
            </option>

            <option value="hover">
              Hover
            </option>

            <option value="active">
              Active
            </option>

            <option value="disabled">
              Disabled
            </option>

          </select>

          <div className="dts-button-group">

            <button
              type="button"
              className="dts-btn dts-primary"
              data-state={buttonState}
              disabled={
                buttonState === 'disabled'
              }
              onClick={() => setSaved(true)}
            >
              Save changes
            </button>

            <button
              type="button"
              className="dts-btn dts-secondary"
              data-state={buttonState}
              disabled={
                buttonState === 'disabled'
              }
              onClick={() => setSaved(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="dts-btn dts-danger"
              data-state={buttonState}
              disabled={
                buttonState === 'disabled'
              }
              onClick={() => setSaved(false)}
            >
              Delete
            </button>

            <button
              type="button"
              className="dts-btn dts-primary"
              disabled
            >
              Unavailable
            </button>

          </div>

          {saved && (

            <p
              role="status"
              className="dts-success-text"
            >
              Sample action completed.
            </p>

          )}

        </section>

      )}

      {/* Form components */}

      {shouldShow('forms') && (

        <section className="dts-card">

          <h2 className="dts-section-name">
            Form controls
          </h2>

          <form
            className="dts-form"
            onSubmit={(event) => {
              event.preventDefault()
              setSaved(true)
            }}
          >

            <label htmlFor={`${id}-email`}>
              Email address
            </label>

            <input
              id={`${id}-email`}
              type="email"
              placeholder="name@example.com"
              className="dts-input"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />

            <label htmlFor={`${id}-password`}>
              Password
            </label>

            <input
              id={`${id}-password`}
              type="password"
              className="dts-input"
              placeholder="Enter password"
            />

            <label htmlFor={`${id}-country`}>
              Country
            </label>

            <select
              id={`${id}-country`}
              className="dts-input"
              defaultValue="India"
            >
              <option>India</option>
              <option>Italy</option>
              <option>United Kingdom</option>
            </select>

            <label className="dts-inline">

              <input
                type="checkbox"
                defaultChecked
                className="dts-checkbox"
              />

              Enable notifications

            </label>

            <label className="dts-inline">

              <input
                type="radio"
                name={`${id}-plan`}
                defaultChecked
                className="dts-checkbox"
              />

              Standard plan

            </label>

            <label htmlFor={`${id}-invalid`}>
              Invalid field example
            </label>

            <input
              id={`${id}-invalid`}
              className="dts-input"
              aria-invalid="true"
              aria-describedby={
                `${id}-error`
              }
              defaultValue="Incorrect value"
            />

            <p
              id={`${id}-error`}
              className="dts-error-text"
            >
              Please enter a valid value.
            </p>

            <label htmlFor={`${id}-disabled`}>
              Disabled field
            </label>

            <input
              id={`${id}-disabled`}
              className="dts-input"
              value="Not editable"
              disabled
              readOnly
            />

            <button
              type="submit"
              className="dts-btn dts-primary"
            >
              Submit form
            </button>

            {saved && (
              <p
                role="status"
                className="dts-success-text"
              >
                Demo form submitted.
              </p>
            )}

          </form>

        </section>

      )}

      {/* Alerts */}

      {shouldShow('alerts') && (

        <section className="dts-card">

          <h2 className="dts-section-name">
            Alerts and notifications
          </h2>

          <div className="dts-alert dts-alert-error">
            <CircleAlert size={20} />
            <div>
              <strong>Error</strong>
              <p>Unable to save your changes.</p>
            </div>
          </div>

          <div className="dts-alert dts-alert-success">
            <CircleCheck size={20} />
            <div>
              <strong>Success</strong>
              <p>Your changes have been saved.</p>
            </div>
          </div>

          <div className="dts-alert dts-alert-warning">
            <TriangleAlert size={20} />
            <div>
              <strong>Warning</strong>
              <p>Your subscription expires soon.</p>
            </div>
          </div>

          <div className="dts-alert dts-alert-info">
            <Info size={20} />
            <div>
              <strong>Information</strong>
              <p>A new version is available.</p>
            </div>
          </div>

        </section>

      )}

      {/* Tables */}

      {shouldShow('table') && (

        <section className="dts-card">

          <h2 className="dts-section-name">
            Data table
          </h2>

          <div className="dts-inline">
            <Search size={16} />
            <span className="dts-muted">
              Customer records
            </span>
          </div>

          <div className="dts-table-wrapper">

            <table className="dts-table">

              <thead>

                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>

              </thead>

              <tbody>

                {customers.map((customer) => (

                  <tr
                    key={customer.id}
                    className={
                      selectedRow === customer.id
                        ? 'is-selected'
                        : ''
                    }
                  >

                    <td>{customer.name}</td>

                    <td>{customer.status}</td>

                    <td>

                      <button
                        type="button"
                        className="dts-btn dts-secondary"
                        aria-pressed={
                          selectedRow === customer.id
                        }
                        onClick={() =>
                          setSelectedRow(
                            selectedRow === customer.id
                              ? null
                              : customer.id,
                          )
                        }
                      >

                        {selectedRow === customer.id
                          ? 'Selected'
                          : 'Select'
                        }

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </article>
  )
}

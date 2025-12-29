# 📚 COMPONENT USAGE GUIDE - NUANSA SOLUTION

## 🎯 Panduan Penggunaan Komponen UI

Guide ini menjelaskan cara menggunakan setiap komponen UI yang telah dibuat.

---

## 🔘 BUTTON COMPONENT

### Import
```jsx
import { Button } from '../components/ui'
```

### Basic Usage
```jsx
<Button>Click Me</Button>
```

### Variants
```jsx
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>
```

### Sizes
```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### With Icon
```jsx
import { Download } from 'lucide-react'

<Button icon={<Download size={18} />}>
  Download File
</Button>
```

### Loading State
```jsx
<Button loading={isLoading}>
  Submit Form
</Button>
```

### Full Width
```jsx
<Button fullWidth>
  Full Width Button
</Button>
```

### Complete Example
```jsx
import { Button } from '../components/ui'
import { Save } from 'lucide-react'

function SaveButton() {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await saveData()
    setSaving(false)
  }

  return (
    <Button
      variant="primary"
      size="md"
      icon={<Save size={18} />}
      loading={saving}
      onClick={handleSave}
      fullWidth
    >
      Save Changes
    </Button>
  )
}
```

---

## 📝 INPUT COMPONENT

### Import
```jsx
import { Input } from '../components/ui'
```

### Basic Usage
```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="nama@email.com"
/>
```

### With Error
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

### With Helper Text
```jsx
<Input
  label="Password"
  type="password"
  helperText="Minimum 8 characters"
/>
```

### With Icon
```jsx
import { Mail } from 'lucide-react'

<Input
  label="Email"
  type="email"
  icon={<Mail size={18} />}
  iconPosition="left"
/>
```

### Complete Form Example
```jsx
import { Input } from '../components/ui'
import { Mail, Lock } from 'lucide-react'

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form>
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail size={18} />}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={<Lock size={18} />}
        helperText="Minimum 6 characters"
        required
      />
    </form>
  )
}
```

---

## 📦 CARD COMPONENT

### Import
```jsx
import { Card } from '../components/ui'
```

### Basic Usage
```jsx
<Card>
  <p>Card content here</p>
</Card>
```

### With Title & Subtitle
```jsx
<Card
  title="Card Title"
  subtitle="This is a subtitle"
>
  <p>Card content here</p>
</Card>
```

### With Header Action
```jsx
<Card
  title="Settings"
  headerAction={
    <Button variant="outline" size="sm">Edit</Button>
  }
>
  <p>Settings content</p>
</Card>
```

### With Footer
```jsx
<Card
  title="Confirm Action"
  footer={
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </div>
  }
>
  <p>Are you sure you want to continue?</p>
</Card>
```

### Clickable Card
```jsx
<Card
  clickable
  onClick={() => navigate('/details')}
>
  <h3>Click me!</h3>
  <p>This entire card is clickable</p>
</Card>
```

### Hoverable Card
```jsx
<Card hoverable>
  <p>Hover to see effect</p>
</Card>
```

### Padding Variants
```jsx
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="default">Default padding</Card>
<Card padding="lg">Large padding</Card>
```

### Complete Example
```jsx
import { Card } from '../components/ui'
import { Button } from '../components/ui'
import { Package } from 'lucide-react'

function PricingCard({ pkg }) {
  return (
    <Card
      title={pkg.name}
      subtitle={`Rp ${pkg.price.toLocaleString('id-ID')}`}
      headerAction={
        <Package size={24} />
      }
      footer={
        <Button variant="primary" fullWidth>
          Choose Plan
        </Button>
      }
      hoverable
    >
      <ul>
        {pkg.features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>
    </Card>
  )
}
```

---

## 🗂️ MODAL COMPONENT

### Import
```jsx
import { Modal } from '../components/ui'
```

### Basic Usage
```jsx
import { useState } from 'react'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <p>Modal content here</p>
      </Modal>
    </>
  )
}
```

### Sizes
```jsx
<Modal size="sm">Small modal</Modal>
<Modal size="md">Medium modal (default)</Modal>
<Modal size="lg">Large modal</Modal>
<Modal size="xl">Extra large modal</Modal>
<Modal size="full">Full screen modal</Modal>
```

### With Footer
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
  footer={
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

### Without Close Button
```jsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Processing..."
  showCloseButton={false}
  closeOnOverlayClick={false}
>
  <p>Please wait while we process your request...</p>
</Modal>
```

### Complete Example
```jsx
import { useState } from 'react'
import { Modal, Button, Input } from '../components/ui'

function EditProfileModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await saveProfile(formData)
    setSaving(false)
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit Profile
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
      </Modal>
    </>
  )
}
```

---

## 📐 LAYOUT COMPONENTS

### MainLayout
Untuk halaman umum dengan header & footer:

```jsx
import { MainLayout } from '../layouts'

function MyPage() {
  return (
    <MainLayout>
      <div className="container">
        <h1>My Page</h1>
        <p>Content here</p>
      </div>
    </MainLayout>
  )
}
```

### AuthLayout
Untuk halaman authentication (login/register):

```jsx
import { AuthLayout } from '../layouts'

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to your account"
    >
      <LoginForm />
    </AuthLayout>
  )
}
```

---

## 🎨 RESPONSIVE UTILITIES

### Hide/Show by Breakpoint
```jsx
<div className="hide-mobile">Hidden on mobile</div>
<div className="show-mobile">Visible only on mobile</div>

<div className="hide-tablet">Hidden on tablet</div>
<div className="show-tablet">Visible only on tablet</div>

<div className="hide-desktop">Hidden on desktop</div>
<div className="show-desktop">Visible only on desktop</div>
```

### Grid Responsive
```jsx
<div className="grid grid-cols-4">
  {/* 4 columns on desktop, 2 on tablet, 1 on mobile */}
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</div>
```

### Flex Direction
```jsx
<div className="flex flex-col-mobile flex-row-desktop">
  {/* Column on mobile, row on desktop */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 🔍 BEST PRACTICES

### 1. Consistent Spacing
```jsx
<div className="flex flex-col gap-lg">
  <Component1 />
  <Component2 />
</div>
```

### 2. Touch Targets (Mobile)
```jsx
<Button className="touch-target">
  Clickable
</Button>
```

### 3. Loading States
```jsx
{loading ? (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
) : (
  <Content />
)}
```

### 4. Empty States
```jsx
{items.length === 0 ? (
  <div className="empty-state">
    <Package size={48} />
    <p>No items found</p>
    <Button>Add Item</Button>
  </div>
) : (
  <ItemList items={items} />
)}
```

---

## 📱 RESPONSIVE TESTING CHECKLIST

### Desktop (≥1025px)
- [ ] Layout rapi dengan grid 3-4 kolom
- [ ] Sidebar visible dan functional
- [ ] Hover effects working

### Tablet (641-1024px)
- [ ] Grid menyesuaikan 2 kolom
- [ ] Sidebar collapsible
- [ ] Touch-friendly

### Mobile (≤640px)
- [ ] Single column layout
- [ ] No horizontal overflow
- [ ] Font ≥14px
- [ ] Touch targets ≥44px
- [ ] Bottom nav (if applicable)

---

## 🆘 COMMON ISSUES & SOLUTIONS

### Issue: Button too small on mobile
```jsx
<Button size="lg">Large Button</Button>
```

### Issue: Card overflow
```jsx
<Card className="overflow-auto-mobile">
  <WideContent />
</Card>
```

### Issue: Form tidak responsive
```jsx
<div className="form-row">
  {/* Auto stacks on mobile */}
  <Input />
  <Input />
</div>
```

---

## 📞 SUPPORT

Need help? Check:
1. Component files di `src/components/ui/`
2. CSS files di `src/styles/responsive/`
3. Examples di halaman existing

---

**Last Updated:** 29 Desember 2025
**Version:** 1.0.0

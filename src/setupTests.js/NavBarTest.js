
import { describe, it, expect } from 'vitest'
import Navbar from './Navbar'

it('muestra el enlace de inicio de sesión cuando no hay usuario', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText(/Iniciar sesión/i)).toBeInTheDocument()
  })

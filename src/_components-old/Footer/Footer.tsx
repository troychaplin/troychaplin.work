import { Container } from '../Container/Container'
import './Footer.scss'

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <p className="footer__note">
        &copy; {new Date().getFullYear()} Troy Chaplin
        </p>
      </Container>
    </footer>
  )
}

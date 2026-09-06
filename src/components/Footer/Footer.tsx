import { Container } from '../Container/Container'
import './Footer.scss'

export function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__inner">
          <p className="footer__note">
            &copy; {new Date().getFullYear()} Troy Chaplin
          </p>
        </div>
      </Container>
    </footer>
  )
}

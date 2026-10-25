import { contact } from '../content'
import './Contact.css'

export default function Contact() {
  const hasRealContact = Boolean(contact.email || contact.linkedin)

  return (
    <section id="contact" className="contact section" aria-labelledby="contact-heading">
      <div className="container contact__inner">
        <h2 id="contact-heading" className="contact__heading">
          {contact.heading}
        </h2>

        {hasRealContact ? (
          <ul className="contact__links">
            {contact.email && (
              <li>
                <a className="button button--primary" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
            )}
            {contact.linkedin && (
              <li>
                <a
                  className="button button--secondary"
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </li>
            )}
          </ul>
        ) : (
          <p className="contact__placeholder">{contact.comingSoonMessage}</p>
        )}
      </div>
    </section>
  )
}

# Security Policy

The team behind **Google Developer Groups on Campus (GDGoC) - SATI Vidisha** takes the security of our website, infrastructure, and user data seriously. We appreciate responsible disclosure and will collaborate with security researchers and contributors to address vulnerabilities promptly.

---

## 🛡️ Supported Versions

We actively maintain and provide security patches for the following versions:

| Version / Branch | Supported | Notes |
| :--- | :--- | :--- |
| `main` (Production) | ✅ Yes | Deployed on [https://gdgocsati.vercel.app/](https://gdgocsati.vercel.app/) |
| Pre-release / Staging | ✅ Yes | Staging branches and active pull requests |
| Older tagged releases | ❌ No | Please upgrade to the latest production commit |

---

## 🚨 Reporting a Vulnerability

**DO NOT submit security vulnerabilities via public GitHub issues, pull requests, or public discussions.**

If you believe you have discovered a security vulnerability in this project:

1. **Email Directly**: Contact the lead developer privately:
   - **Lead Developer**: **Safal Tiwari**
   - **Email**: [satigdgoncampus@gmail.com](mailto:satigdgoncampus@gmail.com)
   - **Subject Line**: `[SECURITY VULNERABILITY] GDGoC-SATI - <Brief Description>`
2. **Include Necessary Details**:
   - Description of the vulnerability and its potential impact.
   - Exact steps or proof-of-concept (PoC) scripts to reproduce the issue.
   - Affected URLs, endpoints, or components.
   - Any suggested remediations or mitigations if available.
3. **Machine-Readable Security Policy**:
   - RFC 9116 endpoint: [https://gdgocsati.vercel.app/.well-known/security.txt](https://gdgocsati.vercel.app/.well-known/security.txt)

---

## ⏱️ Response & Disclosure Process

When a vulnerability report is submitted:

1. **Initial Acknowledgment**: We will acknowledge receipt of your report within **24 hours**.
2. **Triage & Assessment**: We will assess the severity, reproduce the issue, and confirm the scope within **48–72 hours**.
3. **Remediation & Testing**: A patch will be authored, tested in a private environment, and verified.
4. **Deployment**: The fix will be deployed to the production environment on Vercel and MongoDB backend.
5. **Coordinated Disclosure**: Once patched, a public advisory will be published, giving credit to the reporter (unless the reporter requests anonymity).

---

## 🎯 Scope

### In Scope
- Web application vulnerabilities on [https://gdgocsati.vercel.app/](https://gdgocsati.vercel.app/)
- Authentication and session handling (JWT, OAuth, password reset flows)
- API endpoint privilege escalation or data leakage (`/api/*`)
- Injection vulnerabilities (SQL/NoSQL, XSS, CSRF, SSRF)
- Exposed sensitive keys or secrets in source code

### Out of Scope
- Denial of Service (DoS / DDoS) attacks against third-party hosts (Vercel, Cloudinary, MongoDB Atlas)
- Social engineering, phishing, or physical attacks against community members
- Issues in outdated browsers or unpatched operating systems
- Scanner-generated reports without actionable proof-of-concept

---

## 🏆 Hall of Fame & Acknowledgments

We believe in recognizing individuals who help keep our student community platform safe. Security researchers who submit valid, original, and responsible vulnerability disclosures will be acknowledged in [humans.txt](https://gdgocsati.vercel.app/humans.txt) and our release notes.


const res = await fetch('https://rhode-proxy.raheemelassadi1.workers.dev/')
const html = await res.text()

const match = html.match(/id='js-product-data'>([\s\S]*?)<\/script>/)
if (!match) { console.log('Could not find product data'); process.exit(0) }

const productData = JSON.parse(match[1])
const available = productData.variants.some(v => v.available === true)

console.log('Available:', available)

if (available) {
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'raheemelassadi1@gmail.com',
      subject: '🛍️ Rhode Summer Kit is back in stock!',
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #643a2a;">the summer kit is in stock! 🎉</h2>
          <p>The Rhode Summer Kit just became available. Go grab it before it sells out again!</p>
          <a href="https://www.rhodeskin.com/products/the-summer-kit"
             style="display:inline-block; background:#643a2a; color:white; padding: 12px 24px; border-radius: 99px; text-decoration:none; font-weight:600; margin-top: 1rem;">
            Buy now
          </a>
        </div>
      `
    })
  })
  const data = await emailRes.json()
  console.log('Email sent:', data)
} else {
  console.log('Still out of stock, no email sent.')
}

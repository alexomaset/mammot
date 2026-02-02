import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      fullName,
      email,
      phone,
      companyName,
      projectType,
      projectDescription,
      budget,
      timeline,
      hearAboutUs,
      additionalInfo
    } = body

    // Validate required fields
    if (!fullName || !email || !phone || !projectType?.length || !projectDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const serviceNames: Record<string, string> = {
      social: 'Social Media Management',
      video: 'Video Editing',
      photo: 'Photography',
      design: 'Graphic Design',
      marketing: 'Digital Marketing'
    }

    const selectedServices = projectType.map((t: string) => serviceNames[t] || t).join(', ')

    await resend.emails.send({
      from: 'Mamot Website <onboarding@resend.dev>',
      to: ['mamotbymuthusi@gmail.com'],
      subject: `New Inquiry from ${fullName}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6D412A; border-bottom: 2px solid #6D412A; padding-bottom: 10px;">New Client Inquiry</h2>

          <h3 style="color: #333;">Contact Information</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}

          <h3 style="color: #333;">Project Details</h3>
          <p><strong>Services Interested In:</strong> ${selectedServices}</p>
          <p><strong>Project Description:</strong></p>
          <p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${projectDescription}</p>

          ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
          ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
          ${hearAboutUs ? `<p><strong>How they heard about us:</strong> ${hearAboutUs}</p>` : ''}
          ${additionalInfo ? `
            <h3 style="color: #333;">Additional Information</h3>
            <p style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${additionalInfo}</p>
          ` : ''}

          <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;" />
          <p style="color: #999; font-size: 12px;">This message was sent from the Mamot website contact form.</p>
        </div>
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

import Image from "next/image"
import Link from "next/link"
import { AiFillInstagram, AiFillFacebook } from "react-icons/ai"
import phonepe from "../../public/images/phonepe.png"
import "./footer.css"

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-container-title">
        <h1>Flow State©</h1>
      </div>
      <div className="footer-row">
        <div className="footer-section">
          <h3>CUSTOMER SERVICE</h3>
          <Link href="/contactUs"> Contact Us</Link>
          <Link href="/myOrders"> Track Order</Link>
          <Link href="/policies#returns"> Return policy</Link>
          <Link href="/policies#damage-claims"> Damaged items</Link>
          <Link href="/policies#cancellations"> Cancellation policy</Link>
          <Link href="/policies#shipping"> Shipping &amp; delivery</Link>
          <Link href="/policies#payments"> Cash on delivery</Link>
        </div>

        <div className="footer-section">
          <h3>COMPANY</h3>
          <Link href="/about-us"> About Us</Link>
          <Link href="/hiring"> We&apos;re Hiring</Link>
          <Link href="/terms-and-conditions"> Terms & Conditions</Link>
          <Link href="/privacy-policy"> Privacy Policy</Link>
        </div>

        <div className="footer-section">
          <h3>CONNECT WITH US</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <AiFillInstagram size={24} />
          </div>
        </div>

        <div className="footer-section">
          <h3>100% SECURE PAYMENT</h3>
          <div className="phonepe-logo">
            <Image src={phonepe} alt="PhonePe Logo" id="phonepe-logo" />
          </div>
        </div>
        {/* 
        <div className="footer-section">
          <h3>KEEP UP TO DATE</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
            <input type="email" placeholder="Enter Email Id" style={{ padding: '10px', marginRight: '10px', marginLeft: '0px', border: 'none', borderRadius: '4px', width: '130px' }} />
            <button style={{ padding: '10px 20px', backgroundColor: '#ff4242', border: 'none', borderRadius: '4px', color: '#000' }}>Subscribe</button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Footer

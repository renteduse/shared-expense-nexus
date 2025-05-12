
import { motion } from "framer-motion";
import { PageTransition } from "@/components/AnimationProvider";

const Privacy = () => {
  return (
    <PageTransition>
      <div className="container max-w-3xl py-12 px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="prose prose-lg mx-auto dark:prose-invert"
        >
          <h1>Privacy Policy</h1>
          <p>Last Updated: May 12, 2025</p>

          <p>
            At BudgetSplit, we take your privacy seriously. This Privacy Policy explains what personal information we collect, how we use it, and the choices you have regarding your data.
          </p>

          <h2>1. Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Your name</li>
            <li>Email address</li>
            <li>Password (stored in encrypted form)</li>
            <li>Profile picture (if provided)</li>
          </ul>

          <h3>Usage Data</h3>
          <p>We also collect information about how you use our application:</p>
          <ul>
            <li>Groups you create or join</li>
            <li>Expenses you record</li>
            <li>Payment information you enter</li>
            <li>Device information and IP address</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Respond to your comments and questions</li>
            <li>Send you technical notices and updates</li>
            <li>Monitor usage patterns and analyze trends</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We may share your information with:</p>
          <ul>
            <li>Other group members (only the information necessary for expense tracking)</li>
            <li>Service providers who help us operate our business</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p>We will never sell your personal data to third parties.</p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no internet or electronic storage system is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Correct inaccurate or incomplete information</li>
            <li>Request deletion of your data (subject to certain exceptions)</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Request restrictions on processing</li>
            <li>Export your data in a portable format</li>
          </ul>

          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts. You can control cookies through your browser settings.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our service is not directed to children under 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will delete such information from our servers.
          </p>

          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@budgetsplit.com.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Privacy;

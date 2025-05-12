
import { motion } from "framer-motion";
import { PageTransition } from "@/components/AnimationProvider";

const Terms = () => {
  return (
    <PageTransition>
      <div className="container max-w-3xl py-12 px-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
          className="prose prose-lg mx-auto dark:prose-invert"
        >
          <h1>Terms of Service</h1>
          <p>Last Updated: May 12, 2025</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to BudgetSplit. By accessing or using our website, mobile application, or any of our services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>

          <h2>2. Definitions</h2>
          <p><strong>Service</strong> refers to the BudgetSplit application.</p>
          <p><strong>User</strong> refers to individuals who use our Service.</p>
          <p><strong>Personal Data</strong> is information that can be used to identify you.</p>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2>4. Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content you post on or through the Service.
          </p>
          <p>
            By posting content on or through the Service, you represent and warrant that such content does not violate third-party rights.
          </p>

          <h2>5. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
          </p>

          <h2>6. Limitation Of Liability</h2>
          <p>
            In no event shall BudgetSplit, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>7. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@budgetsplit.com.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Terms;

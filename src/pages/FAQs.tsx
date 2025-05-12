
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageTransition } from "@/components/AnimationProvider";
import { motion } from "framer-motion";

const FAQs = () => {
  return (
    <PageTransition>
      <div className="container max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Find answers to common questions about BudgetSplit
          </motion.p>
        </div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is BudgetSplit?</AccordionTrigger>
              <AccordionContent>
                BudgetSplit is an expense tracking and sharing application that helps groups of people manage shared costs. It's perfect for roommates, trips, events, or any situation where expenses are shared among multiple people.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I create a group?</AccordionTrigger>
              <AccordionContent>
                After signing in, navigate to your dashboard and click on "Create Group". Enter a name for your group and confirm. You'll receive an invite code that you can share with others so they can join your group.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I join an existing group?</AccordionTrigger>
              <AccordionContent>
                From your dashboard, click "Join Group". Enter the invite code provided by the group creator, then click "Join Group". You'll immediately be added to the group and can start participating in expense tracking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I add an expense?</AccordionTrigger>
              <AccordionContent>
                Within a group, click "Add Expense". Fill out the expense details including the amount, who paid, and how it should be split among group members. You can choose equal splits or custom amounts for each participant.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How are balances calculated?</AccordionTrigger>
              <AccordionContent>
                BudgetSplit tracks who paid for what and who owes whom. The system automatically calculates the simplest way to settle debts within the group, minimizing the number of transactions needed to balance everything out.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Can I use different currencies?</AccordionTrigger>
              <AccordionContent>
                Yes, BudgetSplit supports multiple currencies. You can record expenses in different currencies, and the system will convert them using current exchange rates when calculating balances.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we take data security seriously. All personal information and expense data is encrypted both in transit and at rest. We implement industry-standard security measures to protect your information. For more details, please see our Privacy Policy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger>Can I export my group data?</AccordionTrigger>
              <AccordionContent>
                Yes, you can export your group's expense data as a CSV file that can be opened in Excel or other spreadsheet applications. Go to your group page, click the menu button, and select "Export Data".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger>How do I delete my account?</AccordionTrigger>
              <AccordionContent>
                To delete your account, go to your Profile page and scroll down to the "Danger Zone" section. Click "Delete Account" and follow the confirmation steps. Please note that account deletion is permanent and will remove all your data from our systems.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger>Is BudgetSplit free to use?</AccordionTrigger>
              <AccordionContent>
                BudgetSplit offers both free and premium plans. The free plan includes basic expense tracking for small groups. Premium plans offer additional features like currency conversion, expense categories, receipt scanning, and more. Visit our Pricing page for details.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default FAQs;

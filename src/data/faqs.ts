export type Faq = {
  question: string;
  answer: string;
  /**
   * true = the answer deliberately declines to state a number the company has not
   * published. Fill `authoritativeAnswer` in and flip this to false to replace it.
   */
  awaitingCompanyInput: boolean;
};

export const faqs: Faq[] = [
  {
    question: 'What is the capacity range of industrial RO plants?',
    answer:
      'A2Care India engineers industrial reverse osmosis plants from 100 LPH up to 50,000 LPH. Capacity is fixed against your hourly process demand and a raw water analysis, not chosen from a catalogue.',
    awaitingCompanyInput: false,
  },
  {
    question: 'Does A2Care provide installation across India?',
    answer:
      'Yes. A2Care handles installation and commissioning nationwide, from the headquarters at Rudrapur in Uttarakhand to sites across other states, including Uttar Pradesh projects around Gautam Buddha Nagar and Haridwar.',
    awaitingCompanyInput: false,
  },
  {
    question: 'What is the typical delivery time?',
    answer:
      'Delivery depends on plant type, capacity and how much site preparation runs in parallel, so a firm timeline is confirmed with the quotation against your specific scope rather than quoted generically.',
    awaitingCompanyInput: true,
  },
  {
    question: 'Are Annual Maintenance Contracts available?',
    answer:
      'Yes. Maintenance and annual maintenance contracts form part of A2Care’s after-sales support alongside technical assistance, so a plant keeps performing after commissioning rather than at it.',
    awaitingCompanyInput: false,
  },
  {
    question: 'What warranty is offered?',
    answer:
      'Warranty terms are set out with the offer for your system, since coverage differs between the plant package and its wear components. Ask the team and the applicable terms come back with your quotation.',
    awaitingCompanyInput: true,
  },
  {
    question: 'Are ETP and STP systems designed around applicable pollution control norms?',
    answer:
      'Yes. Effluent and sewage treatment trains are configured against the norms applicable to the site and industry, working from the effluent characteristics recorded during analysis.',
    awaitingCompanyInput: false,
  },
  {
    question: 'How can customers request a quotation?',
    answer:
      'Use the project enquiry form, call +91-9336432885 or +91-7017572336, or message on WhatsApp. Send a raw water report and your required capacity with the enquiry and the engineering response is quicker.',
    awaitingCompanyInput: false,
  },
  {
    question: 'Which industries does A2Care serve?',
    answer:
      'Food and beverage, pharmaceutical, healthcare, educational institutions, chemical manufacturing, textile manufacturing, hospitality, commercial buildings, industrial manufacturing, and infrastructure and construction.',
    awaitingCompanyInput: false,
  },
];

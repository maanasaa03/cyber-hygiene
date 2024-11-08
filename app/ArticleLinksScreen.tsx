import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Article = {
  title: string;
  link: string;
};

type ArticlesData = {
  [key: string]: Article[];
};

type SummariesData = {
  [key: string]: string;
};

export default function ArticleLinksScreen() {
  const { module } = useLocalSearchParams<{ module?: string | string[] }>(); // Access the passed module parameter
  const router = useRouter();

  const summaries: { [key: string]: string } = {
    authandaccess:
      "Authentication and access control ensure that only authorized users can access systems and data. Strong passwords, multi-factor authentication (MFA), and secure password management are key to protecting accounts. These measures reduce the risk of unauthorized access to sensitive information.",
    phishing:
      "Phishing attacks trick individuals into sharing private information by posing as trustworthy entities, often through fake emails, texts, or websites. Recognizing signs like urgent requests or suspicious links can help prevent data theft. Staying vigilant can significantly reduce the risk of falling for these scams.",
    securebrowsing:
      "Secure browsing practices, such as using HTTPS websites, avoiding suspicious links, and enabling browser security features, help protect data from online threats. Regularly updating browsers and using reputable antivirus software also add layers of protection against malware and hackers.",
    publicwifi:
      "Public Wi-Fi networks are convenient but can expose users to data interception by hackers. To stay safe, use a VPN, avoid sensitive activities like online banking, and disable file sharing. Taking precautions when connected to public networks can help protect your data from unauthorized access.",
    introtocyber:
      "Cyber hygiene refers to basic practices that keep devices and data secure, like using antivirus software, regularly updating systems, and managing passwords. Good cyber hygiene helps prevent malware infections and data breaches, building a foundational defense against various cyber threats."
  };
  

  // Dummy data: Replace this with actual data or API call for fetching related articles
  const articles: ArticlesData = {
    authandaccess: [
      { title: "Why Password Management is Important", link: "https://blog.lastpass.com/posts/2024/08/password-hygiene" },
      { title: "How to Create a Strong Password", link: "https://www.vic.gov.au/passwords" },
      { title: "Password Security: Best Practices for 2024", link: "https://novatech.net/blog/password-security-in-2024-a-deep-dive-into-best-practices#:~:text=Best%20Practices%20for%20Password%20Security%20in%202024%201,Regularly%20Update%20and%20Audit%20Passwords%20...%20More%20items" },
    ],
    phishing: [
      { title: "What is Phishing?", link: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-frauds-and-scams/spoofing-and-phishing" },
      { title: "Recognizing Phishing Emails", link: "https://www.cisa.gov/secure-our-world/teach-employees-avoid-phishing#:~:text=Employees%20should%20be%20trained%20to%20look%20for%20basic,to%20think%20about%20whether%20the%20request%20seems%20legitimate." },
      { title: "Phishing: A Threat You Can Avoid", link: "https://learn.microsoft.com/en-us/microsoft-365/business-premium/m365bp-avoid-phishing-and-attacks?view=o365-worldwide" },
      { title: "How to Spot a Phishing Attack", link: "https://www.ftc.gov/business-guidance/small-businesses/cybersecurity/phishing#:~:text=What%20You%20Can%20Do.%20Before%20you" },
    ],
    securebrowsing: [
      { title: "Best Practices for Secure Browsing", link: "https://internetprivacy.com/safe-browsing-practices/#:~:text=What%20Are%20The%20Safe%20Browsing%20Practices%3F%201%201.,5%205.%20Use%20Different%20Browsers%20for%20Different%20Activities" },
      { title: "The Importance of Using HTTPS", link: "https://www.cloudflare.com/learning/ssl/why-use-https/" },
      { title: "Is This Website Safe?", link: "https://www.avast.com/c-website-safety-check-guide#:~:text=Is%20This%20Website%20Safe?%20Your%20Complete" },
    ],
    publicwifi: [
      { title: "How to Stay Safe on Public Wi-Fi", link: "https://www.kaspersky.co.uk/resource-center/preemptive-safety/public-wifi" },
      { title: "How to Protect Your Data on Public Wi-Fi", link: "https://consumer.ftc.gov/articles/are-public-wi-fi-networks-safe-what-you-need-know#:~:text=Create%20and%20use%20strong%20passwords%20and%20turn%20on,updates%20to%20keep%20up%20with%20the%20latest%20protections." },
      { title: "The Dangers of Using Public Wi-Fi (and How To Stay Safe)", link: "https://www.aura.com/learn/dangers-of-public-wi-fi" },
      { title: "Are Public Wi-Fi Networks Safe?", link: "https://consumer.ftc.gov/articles/are-public-wi-fi-networks-safe-what-you-need-know" },
      { title: "Public Wi-Fi: A guide to the risks and how to stay safe", link: "https://us.norton.com/blog/privacy/public-wifi" },
    ],
    introtocyber: [
      { title: "What Is Cyber Hygiene and Who Is Responsible for It?", link: "https://www.bing.com/ck/a?!&&p=eac8b7ff16cbafb49aa78d741eea86524a504e7fa803464efaded40744b463c2JmltdHM9MTcyODM0NTYwMA&ptn=3&ver=2&hsh=4&fclid=361cc928-8af1-6d02-204a-dd828b436c09&psq=A+Beginner%E2%80%99s+Guide+to+Cyber+Hygiene+-+Trend+Micro&u=a1aHR0cHM6Ly9jb21tdW5pdHkubWljcm9mb2N1cy5jb20vY3liZXJyZXMvYi9jeWJlcnNlY3VyaXR5LWJsb2cvcG9zdHMvd2hhdC1pcy1jeWJlci1oeWdpZW5lLWFuZC13aG8taXMtcmVzcG9uc2libGUtZm9yLWl0Izp-OnRleHQ9Q3liZXIgaHlnaWVuZSBpcyBhIHNldCBvZg&ntb=1" },
      { title: "The Importance of Using HTTPS", link: "https://www.cloudflare.com/learning/ssl/why-use-https/" },
      { title: "Cyber Hygiene 101", link: "https://snyk.io/learn/cybersecurity-hygiene/" },
      { title: "What is Cybersecurity? Everything You Need to Know", link: "https://www.simplilearn.com/introduction-to-cyber-security-article" },
      { title: "Introduction to Cybersecurity: What Beginners Need to Know", link: "https://digitalskills.engin.umich.edu/cybersecurity/introduction-to-cybersecurity/" },
    ],
  };

  const moduleKey = module && Array.isArray(module) ? module[0] : module || "defaultModule";
  const relatedArticles = moduleKey && articles[moduleKey] ? articles[moduleKey] : [];
  const summaryText = summaries[moduleKey] || "Explore articles on this topic.";

  const handleLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Can't open this URL: ${url}`);
    }
  };

  if (relatedArticles.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No articles available for this module.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>
        {moduleKey.replace(/([a-z])([A-Z])/g, '$1 $2')}
      </Text>
  
      {/* Summary Text Container */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>{summaryText}</Text>
      </View>
  
      {/* Articles Container */}
      <View style={styles.contentContainer}>
        {relatedArticles.map((article, index) => (
          <TouchableOpacity
            key={index}
            style={styles.articleCard}
            onPress={() => handleLinkPress(article.link)}
          >
            <Text style={styles.articleTitle}>{article.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
  
      {/* Back to Home Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
  
  
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E7DDFF',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF', // White background for content
    padding: 20,
    borderRadius: 10, // Optional: adds rounded corners to the container
    marginBottom: 20,
    shadowColor: "#000", // Optional: adds shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF', // White background for the summary container
    padding: 20,
    borderRadius: 10, // Rounded corners for the container
    marginBottom: 20,
    shadowColor: "#000", // Optional: shadow for better visibility
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B0082',
  },
  summaryText: {
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 20,
    lineHeight: 22,
  },
  articleCard: {
    backgroundColor: '#6A0DAD', // Purple color for article cards
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  articleTitle: {
    fontSize: 16,
    color: '#FFF',
  },
  backButton: {
  padding: 12,
  backgroundColor: '#6A0DAD',
  borderRadius: 10,
  alignItems: 'center',
  alignSelf: 'center', // Center the button
  width: '60%',        // Make button narrower
  marginTop: 20,
},

  backButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
});












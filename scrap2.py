from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
import sys

# Function to fetch terms and conditions from a website
def fetch_terms_and_conditions(url):
    # Setup Selenium
    options = Options()
    options.headless = True
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    # Navigate to the website
    driver.get(url)
    
    # Wait for a few seconds for the website to load completely
    time.sleep(5)  # Adjust the sleep time as needed
    
    # Find the body element
    body_element = driver.find_element(By.TAG_NAME, 'body')
    
    # Extract the text of the body
    body_text = body_element.text
    
    # Close the browser
    driver.quit()
    
    return body_text

# Function to summarize terms and conditions
def summarize_terms_and_conditions(terms_text):
    # Initialize the parser and tokenizer
    parser = PlaintextParser.from_string(terms_text, Tokenizer("english"))

    # Initialize the summarizers
    lsa_summarizer = LsaSummarizer(Stemmer("english"))

    # Extract summaries
    lsa_summary = lsa_summarizer(parser.document, 4)  # Number of sentences in the summary

    # Join the summarized sentences into a single string
    summarized_text = ' '.join([str(sentence) for sentence in lsa_summary])

    # Remove the URL from the summarized text
    summarized_text = summarized_text.replace(terms_text.split()[0], '')

    return summarized_text.strip()

# Main function
def main():
    # Get URL from command-line arguments
    url = sys.argv[1]
    print("URL:", url)
    
    # Fetch terms and conditions from the website
    terms_text = fetch_terms_and_conditions(url)

    if terms_text:
        # Summarize terms and conditions
        summarized_text = summarize_terms_and_conditions(terms_text)
        print(summarized_text)  # Print summarized text only
    else:
        print("No terms and conditions fetched from the website.")

# Run the main function
if __name__ == "__main__":
    main()

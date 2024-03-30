# scraper.py

import requests
from bs4 import BeautifulSoup

def scrape_terms_and_conditions(url):
    try:
        # Fetch the HTML content of the terms and conditions page
        response = requests.get(url)
        if response.status_code == 200:
            html_content = response.text
            
            # Parse the HTML using BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Find the terms and conditions text (you need to inspect the page to determine the correct selectors)
            terms_and_conditions_element = soup.find('div', class_='terms-and-conditions')  # Example selector
            
            if terms_and_conditions_element:
                terms_and_conditions_text = terms_and_conditions_element.get_text()
                return terms_and_conditions_text
            else:
                return "Terms and conditions not found on the page."
        else:
            return "Failed to fetch terms and conditions page."
    except Exception as e:
        return f"Error: {str(e)}"

# Example usage
if __name__ == "__main__":
    url = "https://example.com/terms-and-conditions"
    terms_and_conditions = scrape_terms_and_conditions(url)
    print(terms_and_conditions)

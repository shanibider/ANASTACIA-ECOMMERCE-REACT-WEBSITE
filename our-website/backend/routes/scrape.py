"""
import requests
from bs4 import BeautifulSoup
import json

url = "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html"
response = requests.get(url)

soup = BeautifulSoup(response.content, 'html.parser')

# Find all book containers on the page
book_containers = soup.find_all('li', class_='col-xs-6 col-sm-4 col-md-3 col-lg-3')

# Loop through each book container to extract data
for book in book_containers:
    # Extract title
    title = book.h3.a.attrs['title']

    # Extract rating
    rating = book.p.attrs['class'][1]

    # Extract price
    price = book.select('div p.price_color')[0].get_text()

    # Print the extracted data
    print(f'Title: {title}\nRating: {rating}\nPrice: {price}\n\n')
"""
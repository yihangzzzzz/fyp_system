import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import re
import os
from datetime import datetime
import json
import sys

result = {}

def extract_order_no(pdf_path):
    
    
    
    # Open the PDF file using pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        first_page = pdf.pages[0]  # Access the first page of the PDF
        
        # Extract text from the first page
        text = first_page.extract_text()

        # Use a regular expression to find the order number after "ORDER NO."
        match1 = re.search(r"ORDER NO\.\s*(\d+)", text)
        match2 = re.search(r"Created on\s*([\d]{1,2}-[A-Za-z]{3}-[\d]{4})", text)
        match3 = []

        for page in pdf.pages:
            text = page.extract_text()
            
            if text:
                # Split text into lines
                lines = text.split('\n')
                
                # Initialize variables
                items_index = []
                
                # Find the line with 'Description'
                for i, line in enumerate(lines):
                    if 'DESCRIPTION' in line:
                        # If 'DESCRIPTION' is found, store the line number
                        items_index.append(i)
                
                # Check if the line with 'Description' was found
                if len(items_index) > 0:
                    # Get the line with 'Description' and the subsequent lines
                    for index in items_index:
                        if index + 3 < len(lines):
                            # Extract the value below 'Description'
                            target_line = lines[index + 3].strip()
                            target_group = re.compile(r'(\d+)\s+(.+?)\s+(\d+)\s+(\d+)').search(target_line)
                            if target_group != None:
                                match3.append([target_group.group(2), target_group.group(3)]) 

        if match1 and match2:
        
            order_no = match1.group(1)  # Extract the order number
            date = match2.group(1)
            item = match3
            parsed_date = datetime.strptime(date, "%d-%b-%Y")
            # Convert it to the format yyyy-mm-dd
            formatted_date = parsed_date.strftime("%Y-%m-%d")
            # return [f"{order_no}", f"{formatted_date}", f"{item}"]
            result['poNumber'] = f"{order_no}"
            result['poDate'] = f"{formatted_date}"
            return
            # return {
            #     "poNumber": f"{order_no}",
            #     "poDate": f"{formatted_date}",
            #     "items": item
            # }
        else:
            return "Order number not found."

def extract_PO_info(pdf_path):
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    pages = convert_from_path(pdf_path, 300)  # Convert to images at 300 DPI
    names = []
    quantities = []

    # Step 2: Process each page
    for page_number, page_image in enumerate(pages):
        # Save the image if needed
        page_image.save(f"page_{page_number + 1}.png", "PNG")
        
        # Apply OCR using Tesseract to extract text and bounding boxes
        data = pytesseract.image_to_data(page_image, output_type=pytesseract.Output.DICT)
        
        target_phrase = ['Full', 'Description:']
        
        # Step 3: Search for the word 'DESCRIPTION' and its location
        for i in range(len(data['text']) - 1):
        # Check if the current word and the next word match the target phrase
            if data['text'][i] == target_phrase[0] and data['text'][i+1] == target_phrase[1]:
        # for i, word in enumerate(data['text']):
        #     if word == 'Full Description':
                # Get bounding box coordinates of 'DESCRIPTION'
                left = data['left'][i+1]
                top = data['top'][i+1]
                width = data['width'][i+1]
                height = data['height'][i+1]

                # Define the region to the right of the word "DESCRIPTION"
                x1, y1 = left + width, top  # Right side of the word
                x2, y2 = left + width + 2000, top + height  # Expand 1000 units to the right, keeping height the same

                # Crop the region from the image
                cropped_region = page_image.crop((x1, y1, x2, y2))

                # Step 4: Extract text from the cropped region
                text_in_area_description = pytesseract.image_to_string(cropped_region)
                names.append(text_in_area_description)
                
        for i, word in enumerate(data['text']):
            if word == 'QTY':
                left = data['left'][i]
                top = data['top'][i]
                width = data['width'][i]
                height = data['height'][i]

                # Define the region below the word 'QTY'
                x1, y1 = left, top + height  # Bottom-left corner of the word
                x2, y2 = left + width, top + height + 300  # Define a larger 

                cropped_region = page_image.crop((x1, y1, x2, y2))
                text_in_area_quantity = pytesseract.image_to_string(cropped_region)
                # print(text_in_area_quantity)
                quantity = re.search(r'\d+', text_in_area_quantity)
                if(quantity):
                    quantities.append(quantity.group())
                        
                
                # print(f"Text below 'DESCRIPTION' on page {page_number + 1}: {text_in_area}")
    items = list(zip(names, quantities))
    result['items'] = items
    return

           
# Example usage
if __name__ == "__main__":
    pdf_path = sys.argv[1]
    
    # script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
    # pdf_path = os.path.join(script_dir, 'Order 8100089191_MobyTablet.pdf') 

    extract_order_no(pdf_path)
    extract_PO_info(pdf_path)
    # print(result)
    print(json.dumps(result))



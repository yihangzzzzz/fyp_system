import pdfplumber
import re
import os
from datetime import datetime
import json
import sys

def extract_order_no(pdf_path):
    
    # Open the PDF file using pdfplumber
    with pdfplumber.open(pdf_path) as pdf:
        first_page = pdf.pages[0]  # Access the first page of the PDF
        
        # Extract text from the first page
        text = first_page.extract_text()

        # Use a regular expression to find the order number after "ORDER NO."
        match1 = re.search(r"ORDER NO\.\s*(\d+)", text)
        match2 = re.search(r"Issued on\s*(\d{2}-[a-zA-Z]{3}-\d{4})", text)
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
            return {
                "poNumber": f"{order_no}",
                "poDate": f"{formatted_date}",
                "items": item
            }
        else:
            return "Order number not found."

# Example usage
if __name__ == "__main__":
    pdf_path = sys.argv[1]
    # script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
    # pdf_path = os.path.join(script_dir, '..', 'images', 'testing.pdf') 
    result = extract_order_no(pdf_path)
    print(json.dumps(result))

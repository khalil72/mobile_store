import requests
import os
import pandas as pd
from openpyxl import load_workbook

# Function to download images
def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Check if the request was successful
        with open(save_path, 'wb') as out_file:
            for chunk in response.iter_content(chunk_size=1024):
                out_file.write(chunk)
        print(f"Image successfully downloaded: {save_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download image from {url}. Error: {e}")

# Read the Excel file containing URLs
def download_images_from_excel(excel_file, output_folder):
    # Load the Excel file
    df = pd.read_excel(excel_file)

    # Ensure output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Loop through each URL in the Excel file
    for index, row in df.iterrows():
        url = row[0]  # Assuming the URL is in the first column
        
        # Extract the image name from the URL
        image_name = url.split("/")[-1]  # Get the last part of the URL as the image name
        save_path = os.path.join(output_folder, image_name)

        # Download the image
        download_image(url, save_path)

# Example usage
excel_file_path = 'itel.xlsx'  # Replace with your Excel file path
output_folder = 'infinix'  # Replace with your output folder path
download_images_from_excel(excel_file_path, output_folder)

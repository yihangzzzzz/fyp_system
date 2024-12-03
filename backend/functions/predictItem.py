import sys
sys.path.append(r"C:\\Users\\Vmuser\\AppData\\Roaming\\Python\\Python312\site-packages")
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json

def predictItems(db_items, query_items):
    predicted_items = []
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(db_items)
    for itemName in query_items:
        query_vector = vectorizer.transform([itemName])
        similarities = list(cosine_similarity(query_vector, tfidf_matrix)[0])
        result_index = similarities.index(max(similarities))
        result_itemName = db_items[result_index]
        predicted_items.append(result_itemName)
    return predicted_items
        
if __name__ == "__main__":
    db_items = sys.argv[1].split(',')
    query_items = sys.argv[2].split(',')
    query_items_quantities = sys.argv[3].split(',')
    predictedResult = predictItems(db_items, query_items)
    result = [[n, v] for n, v in zip(predictedResult, query_items_quantities)]
    
    result = {
        'db items': db_items,
        'query items': query_items,
        'query_item_quantities': query_items_quantities,
        'predictedResult': result
    }
    # print(result)
    print(json.dumps(result))
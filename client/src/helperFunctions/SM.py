from difflib import SequenceMatcher

def similar(a,b):
  return SequenceMatcher(None, a, b).ratio()

string1 = "aaaaaaaaaaa"
string2 = "order a mbl phone"
string3 = "how can I order a smart mobile phone"
string4 = "What is the procedure for ordering a mobile phone"
string5 = "How to order a mobile phone"
string6 = ""

print(similar(string1, string5))
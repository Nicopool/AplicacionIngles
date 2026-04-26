import json

with open('words_temp.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sql_statements = []
for item in data:
    word = item['word'].replace("'", "''")
    translation = item['translation'].replace("'", "''")
    level = item['level']
    w_type = item['type'].replace("'", "''")
    hint = item['hint'].replace("'", "''")
    example = item['example'].replace("'", "''")
    
    sql = f"INSERT INTO public.hangman_words (level, word, hint, translation, type, example) VALUES ('{level}', '{word}', '{hint}', '{translation}', '{w_type}', '{example}');"
    sql_statements.append(sql)

with open('insert_words.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_statements))

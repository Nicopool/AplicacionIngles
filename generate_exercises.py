import json

exercises = []

# --- LISTENING ---
listening_data = {
    'A1': [
        ("The ___ is blue.", "sky"),
        ("I have two ___.", "cats"),
        ("She likes to eat ___.", "apples"),
        ("My ___ is John.", "name"),
        ("He is reading a ___.", "book"),
        ("They go to ___ every day.", "school"),
        ("Please close the ___.", "door"),
        ("I drink ___ in the morning.", "coffee"),
        ("The ___ is sleeping.", "dog"),
        ("We play ___ on weekends.", "tennis")
    ],
    'A2': [
        ("I went to the ___ yesterday.", "supermarket"),
        ("She bought a new ___.", "dress"),
        ("My favorite season is ___.", "summer"),
        ("He was watching ___ last night.", "television"),
        ("The ___ departs at 9 AM.", "train"),
        ("We stayed in a nice ___.", "hotel"),
        ("They are planning a ___ to Paris.", "trip"),
        ("I need to buy some ___.", "groceries"),
        ("The ___ was very interesting.", "movie"),
        ("She is learning to play the ___.", "guitar")
    ],
    'B1': [
        ("The company is launching a new ___.", "product"),
        ("He received a ___ for his hard work.", "promotion"),
        ("They are discussing the new ___.", "project"),
        ("She has a lot of ___ in her field.", "experience"),
        ("We need to improve our ___ skills.", "communication"),
        ("The ___ of the meeting is at 3 PM.", "beginning"),
        ("He is looking for a new ___.", "opportunity"),
        ("The ___ was delayed due to weather.", "flight"),
        ("She gave a great ___ today.", "presentation"),
        ("The ___ rate is decreasing.", "unemployment")
    ],
    'B2': [
        ("The government announced a new ___.", "policy"),
        ("The research requires careful ___.", "analysis"),
        ("They reached a mutual ___.", "agreement"),
        ("The environmental ___ is severe.", "impact"),
        ("He emphasized the ___ of education.", "importance"),
        ("She has a very strong ___ in science.", "background"),
        ("The new law will ___ next year.", "implement"),
        ("We must consider the long-term ___.", "consequences"),
        ("The discovery was a major ___.", "breakthrough"),
        ("The ___ of the species is crucial.", "preservation")
    ],
    'C1': [
        ("The paradox is inherently ___.", "complex"),
        ("Her argument was completely ___.", "persuasive"),
        ("The economic ___ is quite unstable.", "infrastructure"),
        ("He provided an eloquent ___ of the theory.", "explanation"),
        ("The legislation was deemed ___.", "controversial"),
        ("We need to mitigate the ___ risks.", "potential"),
        ("The sheer ___ of the task is daunting.", "magnitude"),
        ("The findings challenge the current ___.", "paradigm"),
        ("Her approach is highly ___.", "unconventional"),
        ("The historical context is often ___.", "overlooked")
    ]
}

# --- WRITING ---
writing_data = {
    'A1': [
        ("She ___ a teacher.", "is", "Use 'is' for third-person singular (she, he, it)."),
        ("I ___ from Spain.", "am", "Use 'am' for first-person singular (I)."),
        ("They ___ playing football.", "are", "Use 'are' for plural subjects (they, we, you)."),
        ("He ___ not like apples.", "does", "Use 'does' for negative present simple third-person."),
        ("We ___ a new car.", "have", "Use 'have' for 'we' in present simple.")
    ],
    'A2': [
        ("I ___ to the cinema yesterday.", "went", "Past simple of 'go' is 'went'."),
        ("She ___ English for two years.", "studied", "Past simple of 'study' is 'studied'."),
        ("They ___ dinner when I arrived.", "were", "Past continuous: 'were' + playing/doing."),
        ("He has ___ finished his homework.", "already", "'Already' is used in present perfect for completed actions."),
        ("If it rains, we ___ stay home.", "will", "First conditional uses 'will' + base verb.")
    ],
    'B1': [
        ("I have ___ been to Japan.", "never", "Use 'never' for experiences you haven't had."),
        ("She ___ have forgotten about the meeting.", "must", "'Must have' expresses strong probability in the past."),
        ("If I ___ you, I wouldn't do that.", "were", "Second conditional uses 'were' for all subjects in the 'if' clause."),
        ("The letter was ___ by John.", "written", "Passive voice uses the past participle ('written')."),
        ("He asked me where I ___ going.", "was", "Reported speech shifts present continuous to past continuous.")
    ],
    'B2': [
        ("Had I known, I ___ have helped you.", "would", "Third conditional: 'would have' + past participle."),
        ("Despite ___ tired, she kept working.", "being", "'Despite' is followed by a gerund (-ing) or noun."),
        ("It's high time we ___.", "left", "'It's high time' is followed by the past simple."),
        ("Not only ___ he late, but he was also rude.", "was", "Inversion is used after 'Not only' at the beginning of a sentence."),
        ("The project is ___ to be completed by May.", "expected", "Passive construction for expectations.")
    ],
    'C1': [
        ("Scarcely ___ I arrived when the phone rang.", "had", "Inversion with past perfect after 'Scarcely'."),
        ("She is ___ to have resigned.", "rumored", "Passive reporting structure."),
        ("But for your help, I ___ have failed.", "would", "'But for' + noun means 'if it hadn't been for'."),
        ("Try as he ___, he couldn't open the door.", "might", "'Try as he might' is a concession clause."),
        ("It is imperative that he ___ present.", "be", "Subjunctive mood after 'imperative that'.")
    ]
}

# --- SPEAKING ---
speaking_data = {
    'A1': [
        "What is your name?",
        "I live in a big house.",
        "My favorite color is red.",
        "I like to eat pizza.",
        "The cat is on the table."
    ],
    'A2': [
        "What did you do last weekend?",
        "I usually wake up at seven o'clock.",
        "The weather is very nice today.",
        "I want to travel to London.",
        "She is wearing a blue jacket."
    ],
    'B1': [
        "In my opinion, learning English is important.",
        "I have been working here for two years.",
        "Could you please tell me the way to the station?",
        "I would rather stay home tonight.",
        "Technology has changed our lives significantly."
    ],
    'B2': [
        "The environmental impact of plastic is a major concern.",
        "I completely agree with your point of view.",
        "It is essential to maintain a healthy work-life balance.",
        "Furthermore, the economic implications are profound.",
        "Despite the challenges, we managed to succeed."
    ],
    'C1': [
        "The underlying premise of this argument is fundamentally flawed.",
        "We must address the systemic inequalities prevalent in society.",
        "Her eloquent speech resonated deeply with the audience.",
        "It is highly probable that the paradigm will shift entirely.",
        "Consequently, the mitigation strategies proved to be inadequate."
    ]
}

sql_statements = []

for level, pairs in listening_data.items():
    for prompt, answer in pairs:
        p = f"Listen and complete: {prompt}"
        p_clean = p.replace("'", "''")
        a_clean = answer.replace("'", "''")
        sql = f"INSERT INTO public.exercises (type, level, prompt, answer) VALUES ('listening', '{level}', '{p_clean}', '{a_clean}');"
        sql_statements.append(sql)

for level, items in writing_data.items():
    for prompt, answer, rule in items:
        p = f"Complete: {prompt}"
        p_clean = p.replace("'", "''")
        a_clean = answer.replace("'", "''")
        r_clean = rule.replace("'", "''")
        sql = f"INSERT INTO public.exercises (type, level, prompt, answer, grammar_info) VALUES ('writing', '{level}', '{p_clean}', '{a_clean}', '{r_clean}');"
        sql_statements.append(sql)

for level, sentences in speaking_data.items():
    for sentence in sentences:
        p = f"Read aloud: {sentence}"
        p_clean = p.replace("'", "''")
        s_clean = sentence.replace("'", "''")
        sql = f"INSERT INTO public.exercises (type, level, prompt, answer) VALUES ('speaking', '{level}', '{p_clean}', '{s_clean}');"
        sql_statements.append(sql)

with open('insert_exercises.sql', 'w', encoding='utf-8') as f:
    f.write('\\n'.join(sql_statements))

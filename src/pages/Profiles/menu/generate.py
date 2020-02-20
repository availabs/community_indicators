import psycopg2, json

from config import mars

REGION = ['36001', '36083', '36093', '36091', '36039', '36021', '36115', '36113']

def getCounties(cursor):
    sql = '''
        SELECT geoid, namelsad
        FROM geo.tl_2017_us_county
        WHERE geoid = ANY(%s)
    '''
    cursor.execute(sql, [REGION])
    return [c for c in cursor]
def processCounty(geoid, name):
    return {
        "name": name,
        "geoid": geoid,
        "path": "/profile/" + geoid,
        "children": []
    }

def getCousubs(cursor, geoid):
    sql = '''
        SELECT geoid, namelsad
        FROM geo.tl_2017_36_cousub
        WHERE SUBSTRING(geoid FROM 1 FOR 5) = %s
    '''
    cursor.execute(sql, [geoid])
    return [c for c in cursor]

def getPlaces(cursor, geoid):
    sql = '''
        SELECT c.geoid, p.name, lsad
        FROM geo.places_in_counties AS c
        JOIN geo.tl_2017_36_place AS p
        ON c.geoid = p.geoid
        WHERE county_geoid = %s
    '''
    cursor.execute(sql, [geoid])
    return [p for p in cursor]

def has(list, name):
    for n in list:
        if name.lower() in n: return True
    return False

def processChild(geoid, name):
    return {
        "name": name,
        "path": "/profile/" + geoid
    }
def getName(name, lsad=None):
    switch = {
        '21': " borough",
        '25': " city",
        '43': " town",
        '47': " village"
    }
    return name + switch.get(lsad, "")

def main():
    conn = psycopg2.connect(mars)
    cursor = conn.cursor()

    counties = sorted(getCounties(cursor), key=lambda c: c[1])

    menu = [processCounty(*c) for c in counties]

    cousubNames = []
    placeNames = []

    for county in menu:
        geoid = county["geoid"]

        places = sorted(getPlaces(cursor, geoid), key=lambda d: d[1])
        places = [[p[0], getName(*p[1:])] for p in places]
        placeNames.extend([p[1].lower() for p in places])
        # places = [p for p in places if not has(cousubNames, p[1])]

        county["children"].extend([processChild(*p) for p in places])

    for county in menu:
        geoid = county["geoid"]

        cousubs = sorted(getCousubs(cursor, geoid), key=lambda d: d[1])
        cousubs = [[c[0], getName(*c[1:])] for c in cousubs]
        cousubs = [c for c in cousubs if not has(placeNames, c[1])]
        # cousubNames.extend([c[1].lower() for c in cousubs])

        county["children"].extend([processChild(*c) for c in cousubs])

    for county in menu:
        county["children"] = sorted(county["children"], key=lambda d: d["name"])

    with open("submenu.json", "w") as out:
        json.dump([menu], out)

    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()

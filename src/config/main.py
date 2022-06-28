ether = []
matic = []

for _ in range(140):
    s = input()
    network, id, name = map(lambda x: x.split("'")[1], s.split(','))
    hx = hex(int(id))
    if network == 'matic':
        matic.append([id, hx, name])
    else:
        ether.append([id, hx, name])

matic.sort(key = lambda x: x[0])
ether.sort(key = lambda x: x[0])

print('========MATIC========')
for e in matic:
    print(*e)

print('========ETHER========')
for e in ether:
    print(*e)
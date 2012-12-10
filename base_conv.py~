def modNum(num, base, mod):
  runningMod = 0
  for i in xrange(len(num)):
    c = base.index(num[-(i+1)])
    dig = getMod(len(base), i, len(mod))
    runningMod += (c*dig)%len(mod)
    runningMod = runningMod%len(mod)
  return runningMod;

def getMod(base, exp, mod):
  if exp == 0:
    return 1
  if exp == 1:
    return base%mod
  return (base * getMod(base, exp-1, mod))%mod

def convert(num, base, mod):
  newBase = ''
  while len(num) > 0:
    (num, dig) = divide(num, base, mod)
    newBase = mod[dig] + newBase
  return newBase

def divide(num, base, mod):
  rem = 0
  quotient = ''
  for i in xrange(len(num)):
    c = base.index(num[i])
    rem = rem*len(base) + c
    dig = rem / len(mod)
    rem = rem % len(mod) 
    quotient += base[dig]

  while len(quotient) > 0 and quotient[0] == '0':
    quotient = quotient[1:]
  return (quotient, rem)

dec = '0123456789'
hex = '0123456789abcdef'
b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
fbPass = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_'

print convert("2256", dec, b64)
print convert("aaf1", hex, b64)
print convert("aa23985729f823ffc3222f1", hex, fbPass)

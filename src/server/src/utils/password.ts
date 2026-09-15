export async function hashPassword(password: string) {
  return await Bun.password.hash(password, {
    algorithm: 'argon2id',
    // 19 MiB e' il minimo raccomandato da OWASP per argon2id con timeCost 2.
    // Il valore precedente (1024 = 1 MiB) rendeva il cracking offline molto
    // piu' economico di quanto la scelta di argon2id lasci intendere.
    memoryCost: 19456,
    timeCost: 4,
  });
}

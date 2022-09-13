import { Context, Dict, Random, Schema } from 'koishi'

export const name = 'nonsense'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const corpus: Dict<string[]> = require('./corpus')

const keys = Object.keys(corpus)
keys.push('p')

const regexp = new RegExp(`%(${keys.join('|')})`, 'g')

const desc = {
  vt: '及物动词',
  vi: '不及物动词',
  adj: '形容词',
  adv: '副词',
  n: '名词',
  p: '群成员',
  t: '时间',
}

export function apply(ctx: Context) {
  ctx.command('nonsense <text:rawtext>')
    .alias('ns')
    .action(async ({ session }, text) => {
      if (!text) {
        return Object.entries(desc).map(([k, v]) => `${k}: ${v}`).join('\n')
      }
      const members = text.includes('%p') ? await session.bot.getGuildMemberList(session.guildId) : []
      return text.replace(regexp, (_, key) => {
        if (key === 'p') {
          return Random.pick(members).nickname
        } else {
          return Random.pick(corpus[key])
        }
      })
    })
}

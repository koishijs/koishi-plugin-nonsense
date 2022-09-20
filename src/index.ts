import { Context, Dict, Random, Schema } from 'koishi'

export const name = 'nonsense'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

const corpus: Dict<string[]> = require('./corpus')

const keys = Object.keys(corpus)
keys.push('m')

const regexp = new RegExp(`%(${keys.join('|')})`, 'g')

const desc = {
  vt: '及物动词',
  vi: '不及物动词',
  adj: '形容词',
  adv: '副词',
  pl: '地点',
  n: '名词',
  m: '群成员',
  tf: '时间点',
  tp: '时间段',
}

export function apply(ctx: Context) {
  ctx.command('nonsense <text:rawtext>', '输出随机句子')
    .alias('ns')
    .action(async ({ session }, text) => {
      if (!text) {
        return Object.entries(desc).map(([k, v]) => `${k}: ${v}`).join('\n')
      }
      const members = text.includes('%m') ? await session.bot.getGuildMemberList(session.guildId) : []
      return text.replace(regexp, (_, key) => {
        if (key === 'm') {
          const member = Random.pick(members)
          return member.nickname || member.username
        } else {
          return Random.pick(corpus[key])
        }
      })
    })
}

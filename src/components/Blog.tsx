import 'zenn-content-css';

type Props = {
  html: string
}
export const Blog: React.FC<Props> = ({ html }) => {
  return (
    <div
      // "znc"というクラス名を指定する
      className="znc "
      // htmlを渡す
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
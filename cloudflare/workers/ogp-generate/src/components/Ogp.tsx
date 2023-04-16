interface Props {
  msg: string;
  from?: string;
  to?: string;
}
export const Ogp = ({
  msg,
  from = 'rgba(25,152,97,1)',
  to = 'rgba(0,93,255,1)',
}: Props) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
      <div
        style={{
          height: '90%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // background: `linear-gradient(45deg, ${from} 0%, ${to} 100%)`,
          background: '#A0D6F4',
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80%',
            height: '80%',
            background: 'white',
            borderRadius: '30px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)',
            fontSize: '68px',
          }}
        >
          {msg}
        </div>
      </div>
      <div style={{
        height: '10%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#6CBEEC',
        fontSize: '32px',
      }}>
        ぱんだのITブログ
      </div>
    </div>
  );
};
import React, { useState } from 'react'

const DetailMessage = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How's the HorecaStore development going?",
      sender: 'other',
      timestamp: '10:30 AM',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      text: "Going great! Just finished the payment gateway integration",
      sender: 'me',
      timestamp: '10:32 AM'
    },
    {
      id: 3,
      text: "That's awesome! Which payment provider did you use?",
      sender: 'other',
      timestamp: '10:33 AM',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      text: "We integrated Square, Stripe, and Paymob for different regions",
      sender: 'me',
      timestamp: '10:35 AM'
    },
    {
      id: 5,
      text: "Nice! Multi-gateway support is always tricky. How's the checkout flow?",
      sender: 'other',
      timestamp: '10:36 AM',
      avatar: '👨‍💼'
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }])
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        height: '700px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}>
            👨‍💼
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              Team Discussion
            </h2>
            <div style={{ 
              fontSize: '13px', 
              opacity: 0.9,
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
                animation: 'pulse 2s infinite'
              }}></span>
              Active now
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 14px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
              transition: 'all 0.2s'
            }}>
              📞
            </button>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 14px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '18px',
              transition: 'all 0.2s'
            }}>
              ⚙️
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-end',
                justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`
              }}
            >
              {msg.sender === 'other' && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0
                }}>
                  {msg.avatar}
                </div>
              )}
              <div style={{
                maxWidth: '60%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'me' 
                    ? '20px 20px 4px 20px' 
                    : '20px 20px 20px 4px',
                  background: msg.sender === 'me' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: msg.sender === 'me' ? 'white' : '#1e293b',
                  boxShadow: msg.sender === 'me'
                    ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  fontSize: '15px',
                  lineHeight: '1.5',
                  wordWrap: 'break-word'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#64748b',
                  paddingLeft: msg.sender === 'me' ? '0' : '4px',
                  paddingRight: msg.sender === 'me' ? '4px' : '0',
                  textAlign: msg.sender === 'me' ? 'right' : 'left'
                }}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                👨‍💼
              </div>
              <div style={{
                padding: '14px 18px',
                borderRadius: '20px 20px 20px 4px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                gap: '4px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#cbd5e1',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '-0.32s'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#cbd5e1',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '-0.16s'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#cbd5e1',
                  animation: 'bounce 1.4s infinite ease-in-out both'
                }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div style={{
          padding: '20px 28px',
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <button style={{
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer',
            fontSize: '20px',
            transition: 'all 0.2s',
            flexShrink: 0
          }}>
            📎
          </button>
          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                width: '100%',
                minHeight: '48px',
                maxHeight: '120px',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'none',
                outline: 'none',
                transition: 'all 0.2s',
                background: '#f8fafc'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          <button
            onClick={handleSend}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              cursor: 'pointer',
              color: 'white',
              fontSize: '20px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}
          >
            🚀
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          textarea::placeholder {
            color: #94a3b8;
          }

          div::-webkit-scrollbar {
            width: 8px;
          }

          div::-webkit-scrollbar-track {
            background: transparent;
          }

          div::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
    </div>
  )
}

export default DetailMessage
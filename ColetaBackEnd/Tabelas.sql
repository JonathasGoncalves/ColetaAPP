--Tabela "Motorista"
--Lista os motoristas e as linhas q ele atende.

SELECT DISTINCT b.ZL0_FRETIS AS COD_TRANSPORTADORA, b.ZL0_NOME as NOME_MOTORISTA, a.ZL4_MOTORI AS COD_MOTORISTA, a.ZL4_COD AS VEICULO, a.ZL4_PLACA AS PLACA, ZLW.ZLW_COD AS LINHA
FROM         dbo.ZL4010 AS a INNER JOIN
                         dbo.ZL0010 AS b ON a.ZL4_MOTORI = b.ZL0_COD
                         INNER JOIN dbo.ZLW010 AS ZLW ON ZLW.ZLW_FRETIS = b.ZL0_FRETIS and b.ZL0_FRETLJ = ZLW.ZLW_FRETLJ  and ZLW.D_E_L_E_T_ = ' '
WHERE     (a.D_E_L_E_T_ <> '*') AND (b.D_E_L_E_T_ <> '*')
 

 --Tabela "Linha"
--Lista as linhas com descrição
SELECT DISTINCT RIGHT(REPLICATE('0', 6) + CAST(a.ZLY_ROTA AS varchar(6)), 6) AS LINHA, a.ZLY_DESROT AS DESCRICAO
FROM         dbo.ZLY010 AS a INNER JOIN
                         dbo.JCOM_VCO_COLETA AS b ON RIGHT(REPLICATE('0', 6) + CAST(a.ZLY_ROTA AS varchar(6)), 6) = b.LINHA
WHERE     (a.D_E_L_E_T_ <> '*')



